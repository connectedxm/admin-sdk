import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ConnectedXMResponse, Match } from "@src/interfaces";
import { EVENT_ROUND_MATCHES_QUERY_KEY } from "@src/queries/events/matches/useGetEventRoundMatches";

/**
 * @category Params
 * @group Event
 */
export interface CreateEventMatchParams extends MutationParams {
  eventId: string;
  roundId: string;
}

/**
 * @category Methods
 * @group Event
 */
export const CreateEventMatch = async ({
  eventId,
  roundId,
  adminApiParams,
  queryClient,
}: CreateEventMatchParams): Promise<ConnectedXMResponse<Match>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Match>>(
    `/events/${eventId}/rounds/${roundId}/matches`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ROUND_MATCHES_QUERY_KEY(eventId, roundId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Event
 */
export const useCreateEventMatch = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventMatch>>,
      Omit<CreateEventMatchParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventMatchParams,
    Awaited<ReturnType<typeof CreateEventMatch>>
  >(CreateEventMatch, options, {
    domain: "events",
    type: "create",
  });
};
