import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  SURVEY_QUESTION_CHOICES_QUERY_KEY,
  SURVEY_QUESTION_CHOICE_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Survey-Questions
 */
export interface DeleteSurveyQuestionChoiceParams extends MutationParams {
  surveyId: string;
  questionId: string;
  choiceId: string;
}

/**
 * @category Methods
 * @group Survey-Questions
 */
export const DeleteSurveyQuestionChoice = async ({
  surveyId,
  questionId,
  choiceId,
  adminApiParams,
  queryClient,
}: DeleteSurveyQuestionChoiceParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/surveys/${surveyId}/questions/${questionId}/choices/${choiceId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_QUESTION_CHOICES_QUERY_KEY(surveyId, questionId),
    });
    queryClient.removeQueries({
      queryKey: SURVEY_QUESTION_CHOICE_QUERY_KEY(
        surveyId,
        questionId,
        choiceId
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey-Questions
 */
export const useDeleteSurveyQuestionChoice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteSurveyQuestionChoice>>,
      Omit<DeleteSurveyQuestionChoiceParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSurveyQuestionChoiceParams,
    Awaited<ReturnType<typeof DeleteSurveyQuestionChoice>>
  >(DeleteSurveyQuestionChoice, options);
};
