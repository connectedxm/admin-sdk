import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";

/**
 * @category Params
 * @group Event
 */
export interface StartEventSessionRoundMatchmakingParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  roundId: string;
  targetMatchSize: number;
}

/**
 * @category Methods
 * @group Event
 */
export const StartEventSessionRoundMatchmaking = async ({
  eventId,
  sessionId,
  roundId,
  targetMatchSize,
  adminApiParams,
}: StartEventSessionRoundMatchmakingParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<null>>(
    `/events/${eventId}/sessions/${sessionId}/rounds/${roundId}/start`,
    { targetMatchSize }
  );
  return data;
};

/**
 * @category Mutations
 * @group Event
 */
export const useStartEventSessionRoundMatchmaking = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof StartEventSessionRoundMatchmaking>>,
      Omit<
        StartEventSessionRoundMatchmakingParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    StartEventSessionRoundMatchmakingParams,
    Awaited<ReturnType<typeof StartEventSessionRoundMatchmaking>>
  >(StartEventSessionRoundMatchmaking, options, {
    domain: "events",
    type: "update",
  });
};
