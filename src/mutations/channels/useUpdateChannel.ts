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
import { ChannelUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Channel
 */
export interface UpdateChannelParams extends MutationParams {
  channelId: string;
  channel: ChannelUpdateInputs;
}

/**
 * @category Methods
 * @group Channel
 */
export const UpdateChannel = async ({
  channelId,
  channel,
  adminApiParams,
  queryClient,
}: UpdateChannelParams): Promise<ConnectedXMResponse<Channel>> => {
  if (!channelId) throw new Error("Content Type ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Channel>>(
    `/channels/${channelId}`,
    {
      ...channel,
      id: undefined,
      image: undefined,
      hosts: undefined,
      _count: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: CHANNELS_QUERY_KEY() });
    SET_CHANNEL_QUERY_DATA(queryClient, [channelId || data?.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Channel
 */
export const useUpdateChannel = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateChannel>>,
      Omit<UpdateChannelParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateChannelParams,
    Awaited<ReturnType<typeof UpdateChannel>>
  >(UpdateChannel, options, {
    domain: "channels",
    type: "update",
  });
};
