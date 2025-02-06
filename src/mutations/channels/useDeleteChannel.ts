import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { CHANNELS_QUERY_KEY, CHANNEL_QUERY_KEY } from "@src/queries/channels";

/**
 * Endpoint to delete a specific channel by its ID.
 * This function allows for the removal of a channel from the system, ensuring that all associated data is invalidated and removed from the cache.
 * It is intended for use in administrative contexts where channel management is required.
 * @name DeleteChannel
 * @param {string} channelId (path) - The ID of the channel to be deleted
 * @version 1.3
 **/

export interface DeleteChannelParams extends MutationParams {
  channelId: string;
}

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