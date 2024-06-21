import { Channel, ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  CHANNELS_QUERY_KEY,
  SET_CHANNEL_QUERY_DATA,
} from "@src/queries/channels";

/**
 * @category Params
 * @group Channel
 */
export interface CreateChannelParams extends MutationParams {
  channel: Channel;
}

/**
 * @category Methods
 * @group Channel
 */
export const CreateChannel = async ({
  channel,
  adminApiParams,
  queryClient,
}: CreateChannelParams): Promise<ConnectedXMResponse<Channel>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<ConnectedXMResponse<Channel>>(
    `/contentTypes`,
    channel
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: CHANNELS_QUERY_KEY() });
    SET_CHANNEL_QUERY_DATA(queryClient, [data?.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Channel
 */
export const useCreateChannel = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateChannel>>,
      Omit<CreateChannelParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateChannelParams,
    Awaited<ReturnType<typeof CreateChannel>>
  >(CreateChannel, options);
};
