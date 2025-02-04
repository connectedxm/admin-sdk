import { ConnectedXMResponse, BaseChannelSubscriber } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  CHANNEL_SUBSCRIBERS_QUERY_KEY,
  SET_CHANNEL_SUBSCRIBER_QUERY_DATA,
} from "@src/queries/channels";
import { ChannelSubscriberUpdateInputs } from "@src/params";

/**
 * Endpoint to update a channel subscriber's information.
 * This function allows updating the details of a subscriber associated with a specific channel.
 * It is designed to be used in applications where managing channel subscribers is required.
 * @name UpdateChannelSubscriber
 * @param {string} accountId - The id of the account
 * @param {string} channelId - The id of the channel
 * @param {ChannelSubscriberUpdateInputs} channelSubscriber - The subscriber update inputs
 * @version 1.2
 **/
export interface UpdateChannelSubscriberParams extends MutationParams {
  accountId: string;
  channelId: string;
  channelSubscriber: ChannelSubscriberUpdateInputs;
}

export const UpdateChannelSubscriber = async ({
  accountId,
  channelId,
  channelSubscriber,
  adminApiParams,
  queryClient,
}: UpdateChannelSubscriberParams): Promise<
  ConnectedXMResponse<BaseChannelSubscriber>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put(
    `/channels/${channelId}/subscribers/${accountId}`,
    channelSubscriber
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_SUBSCRIBERS_QUERY_KEY(channelId),
    });
    SET_CHANNEL_SUBSCRIBER_QUERY_DATA(
      queryClient,
      [channelId, accountId],
      data
    );
  }
  return data;
};

export const useUpdateChannelSubscriber = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateChannelSubscriber>>,
      Omit<UpdateChannelSubscriberParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateChannelSubscriberParams,
    Awaited<ReturnType<typeof UpdateChannelSubscriber>>
  >(UpdateChannelSubscriber, options, {
    domain: "channels",
    type: "update",
  });
};