import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { EVENT_SESSION_MATCH_PASSES_QUERY_KEY } from "@src/queries/events/sessions/matches/useGetEventSessionMatchSessionPasses";

/**
 * @category Params
 * @group Event
 */
export interface RemoveEventSessionMatchSessionPassParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  roundId: string;
  matchId: string;
  sessionPassId: string;
}

/**
 * @category Methods
 * @group Event
 */
export const RemoveEventSessionMatchSessionPass = async ({
  eventId,
  sessionId,
  roundId,
  matchId,
  sessionPassId,
  adminApiParams,
  queryClient,
}: RemoveEventSessionMatchSessionPassParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/sessions/${sessionId}/rounds/${roundId}/matches/${matchId}/sessionPasses/${sessionPassId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_MATCH_PASSES_QUERY_KEY(
        eventId,
        sessionId,
        roundId,
        matchId
      ),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Event
 */
export const useRemoveEventSessionMatchSessionPass = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventSessionMatchSessionPass>>,
      Omit<
        RemoveEventSessionMatchSessionPassParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventSessionMatchSessionPassParams,
    Awaited<ReturnType<typeof RemoveEventSessionMatchSessionPass>>
  >(RemoveEventSessionMatchSessionPass, options, {
    domain: "events",
    type: "update",
  });
};
