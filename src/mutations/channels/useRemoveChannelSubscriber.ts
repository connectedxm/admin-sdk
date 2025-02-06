import { ConnectedXMResponse, BaseChannelSubscriber } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { CHANNEL_SUBSCRIBERS_QUERY_KEY } from "@src/queries/channels/useGetChannelSubscribers";

/**
 * Endpoint to remove a subscriber from a specified channel.
 * This function allows the removal of a subscriber from a channel by specifying the channel ID and account ID.
 * It is used in scenarios where managing channel subscriptions is necessary.
 * @name RemoveChannelSubscriber
 * @param {string} channelId (path) - The id of the channel
 * @param {string} accountId (path) - The id of the account
 * @version 1.3
 **/

export interface RemoveChannelSubscriberParams extends MutationParams {
  channelId: string;
  accountId: string;
}

export const RemoveChannelSubscriber = async ({
  channelId,
  accountId,
  adminApiParams,
  queryClient,
}: RemoveChannelSubscriberParams): Promise<
  ConnectedXMResponse<BaseChannelSubscriber>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<
    ConnectedXMResponse<BaseChannelSubscriber>
  >(`/channels/${channelId}/subscribers/${accountId}`);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_SUBSCRIBERS_QUERY_KEY(channelId),
    });
  }
  return data;
};

export const useRemoveChannelSubscriber = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveChannelSubscriber>>,
      Omit<RemoveChannelSubscriberParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation(RemoveChannelSubscriber, options, {
    domain: "channels",
    type: "update",
  });
};