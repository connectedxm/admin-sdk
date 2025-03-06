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
import { SurveyQuestionChoiceCreateInputs } from "../../../params";

/**
 * @category Params
 * @group Survey-Questions
 */
export interface CreateSurveyQuestionChoiceParams extends MutationParams {
  surveyId: string;
  questionId: string;
  choice: SurveyQuestionChoiceCreateInputs;
}

/**
 * @category Methods
 * @group Survey-Questions
 */
export const CreateSurveyQuestionChoice = async ({
  surveyId,
  questionId,
  choice,
  adminApiParams,
  queryClient,
}: CreateSurveyQuestionChoiceParams): Promise<
  ConnectedXMResponse<SurveyQuestionChoice>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<SurveyQuestionChoice>
  >(`/surveys/${surveyId}/questions/${questionId}/choices`, choice);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_QUESTION_CHOICES_QUERY_KEY(surveyId, questionId),
    });
    SET_SURVEY_QUESTION_CHOICE_QUERY_DATA(
      queryClient,
      [surveyId, questionId, data?.data.id.toString()],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey-Questions
 */
export const useCreateSurveyQuestionChoice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateSurveyQuestionChoice>>,
      Omit<CreateSurveyQuestionChoiceParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSurveyQuestionChoiceParams,
    Awaited<ReturnType<typeof CreateSurveyQuestionChoice>>
  >(CreateSurveyQuestionChoice, options, {
    domain: "surveys",
    type: "update",
  });
};
