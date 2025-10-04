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
 * @category Params
 * @group Channel
 */
export interface UpdateChannelSubscriberParams extends MutationParams {
  accountId: string;
  channelId: string;
  channelSubscriber: ChannelSubscriberUpdateInputs;
}

/**
 * @category Methods
 * @group Channel
 */
export const UpdateChannelSubscriber = async ({
  accountId,
  channelId,
  channelSubscriber,
  adminApiParams,
  queryClient,
}: UpdateChannelSubscriberParams): Promise<
  ConnectedXMResponse<BaseChannelSubscriber>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put(
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

/**
 * @category Mutations
 * @group Channel
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
