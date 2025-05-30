import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { EVENT_SESSION_ROUND_MATCHES_QUERY_KEY } from "@src/queries/events/sessions/matches/useGetEventSessionRoundMatches";
import { EVENT_SESSION_ROUNDS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event
 */
export interface DeleteEventSessionMatchParams extends MutationParams {
  eventId: string;
  sessionId: string;
  roundId: string;
  matchId: string;
}

/**
 * @category Methods
 * @group Event
 */
export const DeleteEventSessionMatch = async ({
  eventId,
  sessionId,
  roundId,
  matchId,
  adminApiParams,
  queryClient,
}: DeleteEventSessionMatchParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/sessions/${sessionId}/rounds/${roundId}/matches/${matchId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_ROUND_MATCHES_QUERY_KEY(
        eventId,
        sessionId,
        roundId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_ROUNDS_QUERY_KEY(eventId, sessionId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Event
 */
export const useDeleteEventSessionMatch = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSessionMatch>>,
      Omit<DeleteEventSessionMatchParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSessionMatchParams,
    Awaited<ReturnType<typeof DeleteEventSessionMatch>>
  >(DeleteEventSessionMatch, options, {
    domain: "events",
    type: "del",
  });
};
