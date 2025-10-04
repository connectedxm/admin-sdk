import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, SurveyQuestionChoice } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  SURVEY_QUESTION_CHOICES_QUERY_KEY,
  SET_SURVEY_QUESTION_CHOICE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Survey-Questions
 */
export interface UpdateSurveyQuestionChoiceSubQuestionParams
  extends MutationParams {
  surveyId: string;
  questionId: string;
  choiceId: string;
  subQuestionId: string;
  sortOrder: number;
}

/**
 * @category Methods
 * @group Survey-Questions
 */
export const UpdateSurveyQuestionChoiceSubQuestion = async ({
  surveyId,
  questionId,
  choiceId,
  subQuestionId,
  sortOrder,
  adminApiParams,
  queryClient,
}: UpdateSurveyQuestionChoiceSubQuestionParams): Promise<
  ConnectedXMResponse<SurveyQuestionChoice>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<SurveyQuestionChoice>
  >(
    `/surveys/${surveyId}/questions/${questionId}/choices/${choiceId}/subQuestions/${subQuestionId}`,
    { sortOrder }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_QUESTION_CHOICES_QUERY_KEY(surveyId, questionId),
    });
    SET_SURVEY_QUESTION_CHOICE_QUERY_DATA(
      queryClient,
      [surveyId, questionId, choiceId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey-Questions
 */
export const useUpdateSurveyQuestionChoiceSubQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSurveyQuestionChoiceSubQuestion>>,
      Omit<
        UpdateSurveyQuestionChoiceSubQuestionParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSurveyQuestionChoiceSubQuestionParams,
    Awaited<ReturnType<typeof UpdateSurveyQuestionChoiceSubQuestion>>
  >(UpdateSurveyQuestionChoiceSubQuestion, options);
};
