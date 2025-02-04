import { ConnectedXMResponse, BaseChannelSubscriber } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { CHANNEL_SUBSCRIBERS_QUERY_KEY } from "@src/queries/channels/useGetChannelSubscribers";

/**
 * Adds a subscriber to a specified channel and invalidates the relevant query cache.
 * This function is used to associate an account with a channel as a subscriber, ensuring that the channel's subscriber list is updated.
 * It is particularly useful in applications where real-time updates to channel subscriptions are necessary.
 * @name AddChannelSubscriber
 * @param {string} channelId - The id of the channel
 * @param {string} accountId - The id of the account
 * @version 1.2
 **/
export interface AddChannelsubscriberParams extends MutationParams {
  channelId: string;
  accountId: string;
}

export const AddChannelSubscriber = async ({
  channelId,
  accountId,
  adminApiParams,
  queryClient,
}: AddChannelsubscriberParams): Promise<
  ConnectedXMResponse<BaseChannelSubscriber>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<
    ConnectedXMResponse<BaseChannelSubscriber>
  >(`/channels/${channelId}/subscribers`, { accountId });

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_SUBSCRIBERS_QUERY_KEY(channelId),
    });
  }
  return data;
};

export const useAddChannelSubscriber = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddChannelSubscriber>>,
      Omit<AddChannelsubscriberParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddChannelsubscriberParams,
    Awaited<ReturnType<typeof AddChannelSubscriber>>
  >(AddChannelSubscriber, options, {
    domain: "channels",
    type: "update",
  });
};