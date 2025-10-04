import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, SurveyQuestionChoice } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  SURVEY_QUESTION_CHOICE_QUESTIONS_QUERY_KEY,
  SURVEY_QUESTION_CHOICES_QUERY_KEY,
  SET_SURVEY_QUESTION_CHOICE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Survey-Questions
 */
export interface AddSurveyQuestionChoiceSubQuestionParams
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
export const AddSurveyQuestionChoiceSubQuestion = async ({
  surveyId,
  questionId,
  choiceId,
  subQuestionId,
  adminApiParams,
  queryClient,
}: AddSurveyQuestionChoiceSubQuestionParams): Promise<
  ConnectedXMResponse<SurveyQuestionChoice>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<SurveyQuestionChoice>
  >(
    `/surveys/${surveyId}/questions/${questionId}/choices/${choiceId}/subQuestions/${subQuestionId}`
  );

  if (queryClient && data.status === "ok") {
    SET_SURVEY_QUESTION_CHOICE_QUERY_DATA(
      queryClient,
      [surveyId, questionId, choiceId],
      data
    );
    queryClient.invalidateQueries({
      queryKey: SURVEY_QUESTION_CHOICE_QUESTIONS_QUERY_KEY(
        surveyId,
        questionId,
        choiceId
      ),
    });
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
export const useAddSurveyQuestionChoiceSubQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddSurveyQuestionChoiceSubQuestion>>,
      Omit<
        AddSurveyQuestionChoiceSubQuestionParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddSurveyQuestionChoiceSubQuestionParams,
    Awaited<ReturnType<typeof AddSurveyQuestionChoiceSubQuestion>>
  >(AddSurveyQuestionChoiceSubQuestion, options);
};
