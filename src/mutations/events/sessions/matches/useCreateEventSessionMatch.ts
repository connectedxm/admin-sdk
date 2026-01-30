import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../../useConnectedMutation";
import { ConnectedXMResponse, Match } from "@src/interfaces";
import { EVENT_SESSION_ROUND_MATCHES_QUERY_KEY } from "@src/queries/events/sessions/matches/useGetEventSessionRoundMatches";
import { EVENT_SESSION_ROUNDS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event
 */
export interface CreateEventSessionMatchParams extends MutationParams {
  eventId: string;
  sessionId: string;
  roundId: string;
}

/**
 * @category Methods
 * @group Event
 */
export const CreateEventSessionMatch = async ({
  eventId,
  sessionId,
  roundId,
  adminApiParams,
  queryClient,
}: CreateEventSessionMatchParams): Promise<ConnectedXMResponse<Match>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Match>>(
    `/events/${eventId}/sessions/${sessionId}/rounds/${roundId}/matches`
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
export const useCreateEventSessionMatch = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventSessionMatch>>,
      Omit<CreateEventSessionMatchParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSessionMatchParams,
    Awaited<ReturnType<typeof CreateEventSessionMatch>>
  >(CreateEventSessionMatch, options);
};
