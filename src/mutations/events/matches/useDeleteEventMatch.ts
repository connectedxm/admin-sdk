import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { EVENT_ROUND_MATCHES_QUERY_KEY } from "@src/queries/events/matches/useGetEventRoundMatches";
import { EVENT_ROUNDS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event
 */
export interface DeleteEventMatchParams extends MutationParams {
  eventId: string;
  roundId: string;
  matchId: string;
}

/**
 * @category Methods
 * @group Event
 */
export const DeleteEventMatch = async ({
  eventId,
  roundId,
  matchId,
  adminApiParams,
  queryClient,
}: DeleteEventMatchParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/rounds/${roundId}/matches/${matchId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ROUND_MATCHES_QUERY_KEY(eventId, roundId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ROUNDS_QUERY_KEY(eventId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Event
 */
export const useDeleteEventMatch = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventMatch>>,
      Omit<DeleteEventMatchParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventMatchParams,
    Awaited<ReturnType<typeof DeleteEventMatch>>
  >(DeleteEventMatch, options);
};
