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
export interface AddChannelsubscriberParams extends MutationParams {
  channelId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Channel
 */
export const AddChannelSubscriber = async ({
  channelId,
  accountId,
  adminApiParams,
  queryClient,
}: AddChannelsubscriberParams): Promise<
  ConnectedXMResponse<BaseChannelSubscriber>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<BaseChannelSubscriber>
  >(`/channels/${channelId}/subscribers`, { accountId });

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
