import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  EVENT_SESSION_MATCH_ACCESSES_QUERY_KEY,
  EVENT_SESSION_MATCHES_QUERY_KEY,
  EVENT_SESSION_ROUND_PASSES_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event
 */
export interface RemoveEventSessionMatchAccessParams extends MutationParams {
  eventId: string;
  sessionId: string;
  roundId: string;
  matchId: string;
  accessId: string;
}

/**
 * @category Methods
 * @group Event
 */
export const RemoveEventSessionMatchAccess = async ({
  eventId,
  sessionId,
  roundId,
  matchId,
  accessId,
  adminApiParams,
  queryClient,
}: RemoveEventSessionMatchAccessParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/sessions/${sessionId}/rounds/${roundId}/matches/${matchId}/accesses/${accessId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_MATCH_ACCESSES_QUERY_KEY(
        eventId,
        sessionId,
        roundId,
        matchId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_MATCHES_QUERY_KEY(eventId, sessionId, roundId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_ROUND_PASSES_QUERY_KEY(
        true,
        eventId,
        sessionId,
        roundId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_ROUND_PASSES_QUERY_KEY(
        false,
        eventId,
        sessionId,
        roundId
      ),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Event
 */
export const useRemoveEventSessionMatchAccess = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventSessionMatchAccess>>,
      Omit<
        RemoveEventSessionMatchAccessParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventSessionMatchAccessParams,
    Awaited<ReturnType<typeof RemoveEventSessionMatchAccess>>
  >(RemoveEventSessionMatchAccess, options, {
    domain: "events",
    type: "update",
  });
};
