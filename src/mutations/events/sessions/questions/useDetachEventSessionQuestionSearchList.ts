import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionQuestion, ConnectedXMResponse } from "@src/interfaces";
import {
  EVENT_SESSION_QUESTION_QUERY_KEY,
  SEARCHLISTS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Session-Question
 */
export interface DetachEventSessionQuestionSearchListParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  questionId: string;
}

/**
 * @category Methods
 * @group Event-Session-Question
 */
export const DetachEventSessionQuestionSearchList = async ({
  eventId,
  sessionId,
  questionId,
  adminApiParams,
  queryClient,
}: DetachEventSessionQuestionSearchListParams): Promise<
  ConnectedXMResponse<EventSessionQuestion>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<
    ConnectedXMResponse<EventSessionQuestion>
  >(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/searchlist`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_QUESTION_QUERY_KEY(
        eventId,
        sessionId,
        questionId
      ),
    });
    // Since we don't know which searchlist was detached, invalidate all searchlists
    queryClient.invalidateQueries({
      queryKey: SEARCHLISTS_QUERY_KEY(),
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
export const useDetachEventSessionQuestionSearchList = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DetachEventSessionQuestionSearchList>>,
      Omit<
        DetachEventSessionQuestionSearchListParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DetachEventSessionQuestionSearchListParams,
    Awaited<ReturnType<typeof DetachEventSessionQuestionSearchList>>
  >(DetachEventSessionQuestionSearchList, options);
};
