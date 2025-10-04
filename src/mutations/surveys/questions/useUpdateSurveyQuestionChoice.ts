import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SurveyQuestionChoiceUpdateInputs } from "@src/params";
import {
  SURVEY_QUESTION_CHOICES_QUERY_KEY,
  SET_SURVEY_QUESTION_CHOICE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Survey-Questions
 */
export interface UpdateSurveyQuestionChoiceParams extends MutationParams {
  surveyId: string;
  questionId: string;
  choiceId: string;
  choice: SurveyQuestionChoiceUpdateInputs;
}

/**
 * @category Methods
 * @group Survey-Questions
 */
export const UpdateSurveyQuestionChoice = async ({
  surveyId,
  questionId,
  choiceId,
  choice,
  adminApiParams,
  queryClient,
}: UpdateSurveyQuestionChoiceParams) => {
  if (!choiceId) throw new Error("Choice ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put(
    `/surveys/${surveyId}/questions/${questionId}/choices/${choiceId}`,
    {
      ...choice,
      id: undefined,
      questionId: undefined,
      question: undefined,
      subQuestions: undefined,
      _count: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
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
export const useUpdateSurveyQuestionChoice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSurveyQuestionChoice>>,
      Omit<UpdateSurveyQuestionChoiceParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSurveyQuestionChoiceParams,
    Awaited<ReturnType<typeof UpdateSurveyQuestionChoice>>
  >(UpdateSurveyQuestionChoice, options);
};
