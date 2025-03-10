import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
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
export interface DeleteSurveyQuestionSearchValuesParams extends MutationParams {
  surveyId: string;
  questionId: string;
}

/**
 * @category Methods
 * @group Survey-Questions
 */
export const DeleteSurveyQuestionSearchValues = async ({
  surveyId,
  questionId,
  adminApiParams,
  queryClient,
}: DeleteSurveyQuestionSearchValuesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/surveys/${surveyId}/questions/${questionId}/values`
  );

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
export const useDeleteSurveyQuestionSearchValues = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteSurveyQuestionSearchValues>>,
      Omit<
        DeleteSurveyQuestionSearchValuesParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSurveyQuestionSearchValuesParams,
    Awaited<ReturnType<typeof DeleteSurveyQuestionSearchValues>>
  >(DeleteSurveyQuestionSearchValues, options, {
    domain: "surveys",
    type: "update",
  });
};
