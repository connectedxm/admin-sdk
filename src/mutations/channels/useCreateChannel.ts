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
 * Endpoint to create a new channel within the application.
 * This function allows for the creation of a channel by providing the necessary inputs.
 * It is designed to be used in scenarios where new communication channels need to be established.
 * @name CreateChannel
 * @param {ChannelCreateInputs} channel (body) - The inputs required to create a channel
 * @version 1.3
 **/
export interface CreateChannelParams extends MutationParams {
  channel: ChannelCreateInputs;
}

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