import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { SurveyQuestion, ConnectedXMResponse } from "@src/interfaces";
import { SURVEY_QUESTION_QUERY_KEY, SEARCHLIST_QUERY_KEY } from "@src/queries";
import { AttachSearchListInputs } from "@src/params";

/**
 * @category Params
 * @group Survey-Question
 */
export interface AttachSurveyQuestionSearchListParams extends MutationParams {
  surveyId: string;
  questionId: string;
  searchList: AttachSearchListInputs;
}

/**
 * @category Methods
 * @group Survey-Question
 */
export const AttachSurveyQuestionSearchList = async ({
  surveyId,
  questionId,
  searchList,
  adminApiParams,
  queryClient,
}: AttachSurveyQuestionSearchListParams): Promise<
  ConnectedXMResponse<SurveyQuestion>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<SurveyQuestion>>(
    `/surveys/${surveyId}/questions/${questionId}/searchlist`,
    searchList
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_QUESTION_QUERY_KEY(surveyId, questionId),
    });
    queryClient.invalidateQueries({
      queryKey: SEARCHLIST_QUERY_KEY(searchList.searchListId),
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
export const useAttachSurveyQuestionSearchList = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AttachSurveyQuestionSearchList>>,
      Omit<
        AttachSurveyQuestionSearchListParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AttachSurveyQuestionSearchListParams,
    Awaited<ReturnType<typeof AttachSurveyQuestionSearchList>>
  >(AttachSurveyQuestionSearchList, options);
};
