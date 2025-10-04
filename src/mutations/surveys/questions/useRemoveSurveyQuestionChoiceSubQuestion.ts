import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SURVEY_QUESTION_CHOICES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Survey-Questions
 */
export interface RemoveSurveyQuestionChoiceSubQuestionParams
  extends MutationParams {
  surveyId: string;
  questionId: string;
  choiceId: string;
  subQuestionId: string;
}

/**
 * @category Methods
 * @group Survey-Questions
 */
export const RemoveSurveyQuestionChoiceSubQuestion = async ({
  surveyId,
  questionId,
  choiceId,
  subQuestionId,
  adminApiParams,
  queryClient,
}: RemoveSurveyQuestionChoiceSubQuestionParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/surveys/${surveyId}/questions/${questionId}/choices/${choiceId}/subQuestions/${subQuestionId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_QUESTION_CHOICES_QUERY_KEY(surveyId, questionId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Survey-Questions
 */
export const useRemoveSurveyQuestionChoiceSubQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveSurveyQuestionChoiceSubQuestion>>,
      Omit<
        RemoveSurveyQuestionChoiceSubQuestionParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveSurveyQuestionChoiceSubQuestionParams,
    Awaited<ReturnType<typeof RemoveSurveyQuestionChoiceSubQuestion>>
  >(RemoveSurveyQuestionChoiceSubQuestion, options);
};
