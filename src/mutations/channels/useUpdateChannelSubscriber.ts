import { ConnectedXMResponse, BaseChannelSubscribers } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  CHANNEL_SUBSCRIBERS_QUERY_KEY,
  SET_CHANNEL_SUBSCRIBERS_QUERY_DATA,
} from "@src/queries/channels";

/**
 * @category Params
 * @group ChannelSubscribers
 */
export interface UpdateChannelSubscriberParams extends MutationParams {
  channelId: string;
  accountId: string;
  subscriber: BaseChannelSubscribers;
}

/**
 * @category Methods
 * @group ChannelSubscribers
 */
export const UpdateChannelSubscriber = async ({
  channelId,
  accountId,
  subscriber,
  adminApiParams,
  queryClient,
}: UpdateChannelSubscriberParams): Promise<
  ConnectedXMResponse<BaseChannelSubscribers>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<BaseChannelSubscribers>
  >(`/channels/${channelId}/subscribers/${accountId}`, subscriber);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_SUBSCRIBERS_QUERY_KEY(channelId),
    });
    SET_CHANNEL_SUBSCRIBERS_QUERY_DATA(queryClient, [channelId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group ChannelSubscribers
 */
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
  >(UpdateChannelSubscriber, options);
};
