import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { SurveyQuestion, ConnectedXMResponse } from "@src/interfaces";
import {
  SURVEY_QUESTION_QUERY_KEY,
  SURVEY_QUESTION_SEARCHLIST_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Survey-Question
 */
export interface DetachSurveyQuestionSearchListParams extends MutationParams {
  surveyId: string;
  questionId: string;
}

/**
 * @category Methods
 * @group Survey-Question
 */
export const DetachSurveyQuestionSearchList = async ({
  surveyId,
  questionId,
  adminApiParams,
  queryClient,
}: DetachSurveyQuestionSearchListParams): Promise<
  ConnectedXMResponse<SurveyQuestion>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<
    ConnectedXMResponse<SurveyQuestion>
  >(`/surveys/${surveyId}/questions/${questionId}/searchlist`);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_QUESTION_QUERY_KEY(surveyId, questionId),
    });
    queryClient.invalidateQueries({
      queryKey: SURVEY_QUESTION_SEARCHLIST_QUERY_KEY(surveyId, questionId),
    });
    // Force remove the cached data to ensure it refetches
    queryClient.removeQueries({
      queryKey: SURVEY_QUESTION_SEARCHLIST_QUERY_KEY(surveyId, questionId),
    });
    // Also invalidate all searchlist values queries to ensure fresh data
    queryClient.invalidateQueries({
      predicate: (query) => {
        return query.queryKey[0] === "SEARCHLIST_VALUES";
      },
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey-Question
 */
export const useDetachSurveyQuestionSearchList = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DetachSurveyQuestionSearchList>>,
      Omit<
        DetachSurveyQuestionSearchListParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DetachSurveyQuestionSearchListParams,
    Awaited<ReturnType<typeof DetachSurveyQuestionSearchList>>
  >(DetachSurveyQuestionSearchList, options, {
    domain: "surveys",
    type: "update",
  });
};
