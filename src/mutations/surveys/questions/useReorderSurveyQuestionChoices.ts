import { GetAdminAPI } from "@src/AdminAPI";
import { SurveyQuestionChoice, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SET_SURVEY_QUESTION_CHOICES_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group Survey-Sections
 */
export interface ReorderSurveyQuestionChoicesParams extends MutationParams {
  surveyId: string;
  questionId: string;
  choicesIds: string[];
}

/**
 * @category Methods
 * @group Survey-Sections
 */
export const ReorderSurveyQuestionChoices = async ({
  surveyId,
  questionId,
  choicesIds,
  adminApiParams,
  queryClient,
}: ReorderSurveyQuestionChoicesParams): Promise<
  ConnectedXMResponse<SurveyQuestionChoice[]>
> => {
  if (!questionId) throw new Error("Question ID is undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<
    ConnectedXMResponse<SurveyQuestionChoice[]>
  >(`/surveys/${surveyId}/questions/${questionId}/choices/reorder`, {
    choicesIds,
  });

  if (queryClient && data.status === "ok") {
    SET_SURVEY_QUESTION_CHOICES_QUERY_DATA(
      queryClient,
      [surveyId, questionId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey-Sections
 */
export const useReorderSurveyQuestionChoices = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ReorderSurveyQuestionChoices>>,
      Omit<ReorderSurveyQuestionChoicesParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ReorderSurveyQuestionChoicesParams,
    Awaited<ReturnType<typeof ReorderSurveyQuestionChoices>>
  >(ReorderSurveyQuestionChoices, options, {
    domain: "surveys",
    type: "update",
  });
};
