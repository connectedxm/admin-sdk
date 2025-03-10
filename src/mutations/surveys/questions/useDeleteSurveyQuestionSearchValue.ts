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
export interface DeleteSurveyQuestionSearchValueParams extends MutationParams {
  surveyId: string;
  questionId: string;
  searchValueId: string;
}

/**
 * @category Methods
 * @group Survey-Questions
 */
export const DeleteSurveyQuestionSearchValue = async ({
  surveyId,
  questionId,
  searchValueId,
  adminApiParams,
  queryClient,
}: DeleteSurveyQuestionSearchValueParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/surveys/${surveyId}/questions/${questionId}/values/${searchValueId}`
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
export const useDeleteSurveyQuestionSearchValue = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteSurveyQuestionSearchValue>>,
      Omit<
        DeleteSurveyQuestionSearchValueParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSurveyQuestionSearchValueParams,
    Awaited<ReturnType<typeof DeleteSurveyQuestionSearchValue>>
  >(DeleteSurveyQuestionSearchValue, options, {
    domain: "surveys",
    type: "update",
  });
};
