import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  EVENT_PASS_SESSION_MATCHES_QUERY_KEY,
  EVENT_SESSION_ROUND_MATCH_PASSES_QUERY_KEY,
  EVENT_SESSION_ROUND_MATCHES_QUERY_KEY,
  EVENT_SESSION_ROUND_PASSES_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event
 */
export interface AddEventSessionMatchPassParams extends MutationParams {
  eventId: string;
  sessionId: string;
  roundId: string;
  matchId: string;
  passId: string;
}

/**
 * @category Methods
 * @group Event
 */
export const AddEventSessionMatchPass = async ({
  eventId,
  sessionId,
  roundId,
  matchId,
  passId,
  adminApiParams,
  queryClient,
}: AddEventSessionMatchPassParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<null>>(
    `/events/${eventId}/sessions/${sessionId}/rounds/${roundId}/matches/${matchId}/passes/${passId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_ROUND_MATCH_PASSES_QUERY_KEY(
        eventId,
        sessionId,
        roundId,
        matchId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_ROUND_MATCHES_QUERY_KEY(
        eventId,
        sessionId,
        roundId
      ),
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
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_SESSION_MATCHES_QUERY_KEY(eventId, passId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Event
 */
export const useAddEventSessionMatchPass = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventSessionMatchPass>>,
      Omit<AddEventSessionMatchPassParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventSessionMatchPassParams,
    Awaited<ReturnType<typeof AddEventSessionMatchPass>>
  >(AddEventSessionMatchPass, options, {
    domain: "events",
    type: "update",
  });
};
