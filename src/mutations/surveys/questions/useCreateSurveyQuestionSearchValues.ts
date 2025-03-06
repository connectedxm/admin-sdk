import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, SurveyQuestionChoice } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SURVEY_QUESTION_SEARCH_VALUES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Survey-Questions
 */
export interface CreateSurveyQuestionSearchValuesParams extends MutationParams {
  surveyId: string;
  questionId: string;
  values: string[];
}

/**
 * @category Methods
 * @group Survey-Questions
 */
export const CreateSurveyQuestionSearchValues = async ({
  surveyId,
  questionId,
  values,
  adminApiParams,
  queryClient,
}: CreateSurveyQuestionSearchValuesParams): Promise<
  ConnectedXMResponse<SurveyQuestionChoice>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<SurveyQuestionChoice>
  >(`/surveys/${surveyId}/questions/${questionId}/values`, values);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_QUESTION_SEARCH_VALUES_QUERY_KEY(surveyId, questionId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey-Questions
 */
export const useCreateSurveyQuestionSearchValues = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateSurveyQuestionSearchValues>>,
      Omit<
        CreateSurveyQuestionSearchValuesParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSurveyQuestionSearchValuesParams,
    Awaited<ReturnType<typeof CreateSurveyQuestionSearchValues>>
  >(CreateSurveyQuestionSearchValues, options, {
    domain: "surveys",
    type: "update",
  });
};
