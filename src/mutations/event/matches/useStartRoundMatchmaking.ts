import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";

/**
 * @category Params
 * @group Event
 */
export interface StartRoundMatchmakingParams extends MutationParams {
  eventId: string;
  roundId: string;
  targetMatchSize: number;
}

/**
 * @category Methods
 * @group Event
 */
export const StartRoundMatchmaking = async ({
  eventId,
  roundId,
  targetMatchSize,
  adminApiParams,
}: StartRoundMatchmakingParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<null>>(
    `/events/${eventId}/rounds/${roundId}/start`,
    { targetMatchSize }
  );
  return data;
};

/**
 * @category Mutations
 * @group Event
 */
export const useStartRoundMatchmaking = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof StartRoundMatchmaking>>,
      Omit<StartRoundMatchmakingParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    StartRoundMatchmakingParams,
    Awaited<ReturnType<typeof StartRoundMatchmaking>>
  >(StartRoundMatchmaking, options, {
    domain: "events",
    type: "update",
  });
};
