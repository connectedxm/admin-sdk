import { Channel, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  CHANNELS_QUERY_KEY,
  SET_CHANNEL_QUERY_DATA,
} from "@src/queries/channels";
import { ChannelCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Channel
 */
export interface CreateChannelParams extends MutationParams {
  channel: ChannelCreateInputs;
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
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<ConnectedXMResponse<Channel>>(
    `/channels`,
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
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateChannel>>,
      Omit<CreateChannelParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateChannelParams,
    Awaited<ReturnType<typeof CreateChannel>>
  >(CreateChannel, options, {
    domain: "channels",
    type: "create",
  });
};
