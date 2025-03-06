import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  SurveyQuestionChoiceSubQuestion,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  SURVEY_QUESTION_CHOICE_QUERY_KEY,
  SURVEY_QUESTION_CHOICES_QUERY_KEY,
  SET_SURVEY_QUESTION_CHOICE_QUESTIONS_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Survey-Questions
 */
export interface ReorderSurveyQuestionChoiceSubQuestionsParams
  extends MutationParams {
  surveyId: string;
  questionId: string;
  choiceId: string;
  questionIds: string[];
}

/**
 * @category Methods
 * @group Survey-Questions
 */
export const ReorderSurveyQuestionChoiceSubQuestions = async ({
  surveyId,
  questionId,
  choiceId,
  questionIds,
  adminApiParams,
  queryClient,
}: ReorderSurveyQuestionChoiceSubQuestionsParams): Promise<
  ConnectedXMResponse<SurveyQuestionChoiceSubQuestion[]>
> => {
  if (!questionId) throw new Error("Question ID Undefined");
  if (!choiceId) throw new Error("Choice ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<
    ConnectedXMResponse<SurveyQuestionChoiceSubQuestion[]>
  >(
    `/surveys/${surveyId}/questions/${questionId}/choices/${choiceId}/subQuestions/reorder`,
    {
      questionIds,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_QUESTION_CHOICE_QUERY_KEY(
        surveyId,
        questionId,
        choiceId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: SURVEY_QUESTION_CHOICES_QUERY_KEY(surveyId, questionId),
    });
    SET_SURVEY_QUESTION_CHOICE_QUESTIONS_QUERY_DATA(
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
export const useReorderSurveyQuestionChoiceSubQuestions = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ReorderSurveyQuestionChoiceSubQuestions>>,
      Omit<
        ReorderSurveyQuestionChoiceSubQuestionsParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ReorderSurveyQuestionChoiceSubQuestionsParams,
    Awaited<ReturnType<typeof ReorderSurveyQuestionChoiceSubQuestions>>
  >(ReorderSurveyQuestionChoiceSubQuestions, options, {
    domain: "surveys",
    type: "update",
  });
};
