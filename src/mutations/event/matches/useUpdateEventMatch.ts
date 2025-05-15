import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ConnectedXMResponse, Match } from "@src/interfaces";
import { MatchUpdateInputs } from "@src/params";
import {
  EVENT_ROUND_MATCHES_QUERY_KEY,
  SET_EVENT_ROUND_MATCH_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event
 */
export interface UpdateEventMatchParams extends MutationParams {
  eventId: string;
  roundId: string;
  matchId: string;
  match: MatchUpdateInputs;
}

/**
 * @category Methods
 * @group Event
 */
export const UpdateEventMatch = async ({
  eventId,
  roundId,
  matchId,
  match,
  adminApiParams,
  queryClient,
}: UpdateEventMatchParams): Promise<ConnectedXMResponse<Match>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Match>>(
    `/events/${eventId}/rounds/${roundId}/matches/${matchId}`,
    match
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ROUND_MATCHES_QUERY_KEY(eventId, roundId),
    });

    SET_EVENT_ROUND_MATCH_QUERY_DATA(
      queryClient,
      [eventId, roundId, matchId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event
 */
export const useUpdateEventMatch = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventMatch>>,
      Omit<UpdateEventMatchParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventMatchParams,
    Awaited<ReturnType<typeof UpdateEventMatch>>
  >(UpdateEventMatch, options, {
    domain: "events",
    type: "update",
  });
};
