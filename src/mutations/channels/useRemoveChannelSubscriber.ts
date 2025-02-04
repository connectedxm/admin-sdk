import { ConnectedXMResponse, BaseChannelSubscriber } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { CHANNEL_SUBSCRIBERS_QUERY_KEY } from "@src/queries/channels/useGetChannelSubscribers";

/**
 * @category Params
 * @group Channel
 */
export interface RemoveChannelSubscriberParams extends MutationParams {
  channelId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Channel
 */
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

/**
 * @category Mutations
 * @group Channel
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
  return useConnectedMutation(RemoveChannelSubscriber, options, {
    domain: "channels",
    type: "update",
  });
};
