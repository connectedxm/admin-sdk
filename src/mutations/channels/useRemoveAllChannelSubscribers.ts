import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Channel } from "@src/interfaces";
import {
  SET_CHANNEL_QUERY_DATA,
  CHANNEL_SUBSCRIBERS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Channel
 */
export interface RemoveAllChannelSubscribersParams extends MutationParams {
  channelId: string;
}

/**
 * @category Methods
 * @group Channel
 */
export const RemoveAllChannelSubscribers = async ({
  channelId,
  adminApiParams,
  queryClient,
}: RemoveAllChannelSubscribersParams): Promise<
  ConnectedXMResponse<Channel>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<Channel>>(
    `/channels/${channelId}/subscribers`
  );
  if (queryClient && data.status === "ok") {
    SET_CHANNEL_QUERY_DATA(queryClient, [channelId], data);
    queryClient.invalidateQueries({
      queryKey: CHANNEL_SUBSCRIBERS_QUERY_KEY(channelId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Channel
 */
export const useRemoveAllChannelSubscribers = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveAllChannelSubscribers>>,
      Omit<RemoveAllChannelSubscribersParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveAllChannelSubscribersParams,
    Awaited<ReturnType<typeof RemoveAllChannelSubscribers>>
  >(RemoveAllChannelSubscribers, options);
};

