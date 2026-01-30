import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../../useConnectedMutation";
import { EventSessionQuestion, ConnectedXMResponse } from "@src/interfaces";
import {
  EVENT_SESSION_QUESTION_QUERY_KEY,
  SEARCHLIST_QUERY_KEY,
} from "@src/queries";
import { AttachSearchListInputs } from "@src/params";

/**
 * @category Params
 * @group Event-Session-Question
 */
export interface AttachEventSessionQuestionSearchListParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  searchList: AttachSearchListInputs;
}

/**
 * @category Methods
 * @group Event-Session-Question
 */
export const AttachEventSessionQuestionSearchList = async ({
  eventId,
  sessionId,
  questionId,
  searchList,
  adminApiParams,
  queryClient,
}: AttachEventSessionQuestionSearchListParams): Promise<
  ConnectedXMResponse<EventSessionQuestion>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<EventSessionQuestion>
  >(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/searchlist`,
    searchList
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_QUESTION_QUERY_KEY(
        eventId,
        sessionId,
        questionId
      ),
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
 * @group Event-Session-Question
 */
export const useAttachEventSessionQuestionSearchList = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AttachEventSessionQuestionSearchList>>,
      Omit<
        AttachEventSessionQuestionSearchListParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AttachEventSessionQuestionSearchListParams,
    Awaited<ReturnType<typeof AttachEventSessionQuestionSearchList>>
  >(AttachEventSessionQuestionSearchList, options);
};
