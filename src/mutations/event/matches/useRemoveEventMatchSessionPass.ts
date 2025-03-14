import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { EVENT_MATCH_PASSES_QUERY_KEY } from "@src/queries/events/matches/useGetEventMatchPasses";

/**
 * @category Params
 * @group Event
 */
export interface RemoveSessionMatchSessionPassParams extends MutationParams {
  eventId: string;
  roundId: string;
  matchId: string;
  passId: string;
}

/**
 * @category Methods
 * @group Event
 */
export const RemoveSessionMatchSessionPass = async ({
  eventId,
  roundId,
  matchId,
  passId,
  adminApiParams,
  queryClient,
}: RemoveSessionMatchSessionPassParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/rounds/${roundId}/matches/${matchId}/sessionPasses/${passId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_MATCH_PASSES_QUERY_KEY(eventId, roundId, matchId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Event
 */
export const useRemoveSessionMatchSessionPass = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveSessionMatchSessionPass>>,
      Omit<
        RemoveSessionMatchSessionPassParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveSessionMatchSessionPassParams,
    Awaited<ReturnType<typeof RemoveSessionMatchSessionPass>>
  >(RemoveSessionMatchSessionPass, options, {
    domain: "events",
    type: "update",
  });
};
