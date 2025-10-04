import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  EVENT_ROUND_MATCH_PASSES_QUERY_KEY,
  EVENT_ROUND_MATCHES_QUERY_KEY,
  EVENT_ROUND_PASSES_QUERY_KEY,
} from "@src/queries";
import { EVENT_PASS_MATCHES_QUERY_KEY } from "@src/queries/events/passes/useGetEventPassMatches";

/**
 * @category Params
 * @group Event
 */
export interface RemoveEventMatchPassParams extends MutationParams {
  eventId: string;
  roundId: string;
  matchId: string;
  passId: string;
}

/**
 * @category Methods
 * @group Event
 */
export const RemoveEventMatchPass = async ({
  eventId,
  roundId,
  matchId,
  passId,
  adminApiParams,
  queryClient,
}: RemoveEventMatchPassParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/rounds/${roundId}/matches/${matchId}/passes/${passId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ROUND_MATCH_PASSES_QUERY_KEY(eventId, roundId, matchId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ROUND_MATCHES_QUERY_KEY(eventId, roundId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ROUND_PASSES_QUERY_KEY(true, eventId, roundId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ROUND_PASSES_QUERY_KEY(false, eventId, roundId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_MATCHES_QUERY_KEY(eventId, passId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Event
 */
export const useRemoveEventMatchPass = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventMatchPass>>,
      Omit<RemoveEventMatchPassParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventMatchPassParams,
    Awaited<ReturnType<typeof RemoveEventMatchPass>>
  >(RemoveEventMatchPass, options);
};
