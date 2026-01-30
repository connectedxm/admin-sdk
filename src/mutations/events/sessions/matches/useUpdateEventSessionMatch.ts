import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse, Match } from "@src/interfaces";
import { MatchUpdateInputs } from "@src/params";
import {
  EVENT_SESSION_ROUND_MATCHES_QUERY_KEY,
  SET_EVENT_SESSION_ROUND_MATCH_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event
 */
export interface UpdateEventSessionMatchParams extends MutationParams {
  eventId: string;
  sessionId: string;
  roundId: string;
  matchId: string;
  match: MatchUpdateInputs;
}

/**
 * @category Methods
 * @group Event
 */
export const UpdateEventSessionMatch = async ({
  eventId,
  sessionId,
  roundId,
  matchId,
  match,
  adminApiParams,
  queryClient,
}: UpdateEventSessionMatchParams): Promise<ConnectedXMResponse<Match>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Match>>(
    `/events/${eventId}/sessions/${sessionId}/rounds/${roundId}/matches/${matchId}`,
    match
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_ROUND_MATCHES_QUERY_KEY(
        eventId,
        sessionId,
        roundId
      ),
    });

    SET_EVENT_SESSION_ROUND_MATCH_QUERY_DATA(
      queryClient,
      [eventId, sessionId, roundId, matchId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event
 */
export const useUpdateEventSessionMatch = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSessionMatch>>,
      Omit<UpdateEventSessionMatchParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionMatchParams,
    Awaited<ReturnType<typeof UpdateEventSessionMatch>>
  >(UpdateEventSessionMatch, options);
};
