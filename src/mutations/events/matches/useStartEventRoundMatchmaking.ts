import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";

/**
 * @category Params
 * @group Event
 */
export interface StartEventRoundMatchmakingParams extends MutationParams {
  eventId: string;
  roundId: string;
  targetMatchSize: number;
}

/**
 * @category Methods
 * @group Event
 */
export const StartEventRoundMatchmaking = async ({
  eventId,
  roundId,
  targetMatchSize,
  adminApiParams,
}: StartEventRoundMatchmakingParams): Promise<ConnectedXMResponse<null>> => {
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
export const useStartEventRoundMatchmaking = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof StartEventRoundMatchmaking>>,
      Omit<StartEventRoundMatchmakingParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    StartEventRoundMatchmakingParams,
    Awaited<ReturnType<typeof StartEventRoundMatchmaking>>
  >(StartEventRoundMatchmaking, options);
};
