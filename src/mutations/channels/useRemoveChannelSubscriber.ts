import { ConnectedXMResponse, BaseChannelSubscribers } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { CHANNEL_SUBSCRIBERS_QUERY_KEY } from "@src/queries/channels/useGetChannelSubscribers";

/**
 * @category Params
 * @group ChannelSubscribers
 */
export interface RemoveChannelSubscriberParams extends MutationParams {
  channelId: string;
}

/**
 * @category Methods
 * @group ChannelSubscribers
 */
export const RemoveChannelSubscriber = async ({
  channelId,
  adminApiParams,
  queryClient,
}: RemoveChannelSubscriberParams): Promise<
  ConnectedXMResponse<BaseChannelSubscribers>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<
    ConnectedXMResponse<BaseChannelSubscribers>
  >(`/channels/${channelId}/subscribers`);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_SUBSCRIBERS_QUERY_KEY(channelId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group ChannelSubscribers
 */
export const useRemoveChannelSubscriber = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveChannelSubscriber>>,
      Omit<RemoveChannelSubscriberParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation(RemoveChannelSubscriber, options);
};
