import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { CHANNELS_QUERY_KEY, CHANNEL_QUERY_KEY } from "@src/queries/channels";

/**
 * @category Params
 * @group Channel
 */
export interface DeleteChannelParams extends MutationParams {
  channelId: string;
}

/**
 * @category Methods
 * @group Channel
 */
export const DeleteChannel = async ({
  channelId,
  adminApiParams,
  queryClient,
}: DeleteChannelParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/channels/${channelId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: CHANNELS_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: CHANNEL_QUERY_KEY(channelId) });
  }
  return data;
};

/**
 * @category Mutations
 * @group Channel
 */
export const useDeleteChannel = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteChannel>>,
      Omit<DeleteChannelParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteChannelParams,
    Awaited<ReturnType<typeof DeleteChannel>>
  >(DeleteChannel, options, {
    domain: "channels",
    type: "del",
  });
};
