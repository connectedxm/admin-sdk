import { ConnectedXMResponse, ChannelContent } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  CHANNEL_SUBSCRIBERS_QUERY_KEY,
  SET_CHANNEL_CONTENT_QUERY_DATA,
} from "@src/queries/channels";
import { ChannelContentCreateInputs } from "@src/params";

/**
 * Endpoint to create content for a specified channel.
 * This function allows users to add new content to a specific channel by providing the necessary content details and channel ID.
 * It is designed to be used in applications where channel content management is required.
 * @name CreateChannelContent
 * @param {ChannelContentCreateInputs} content (body) The content to be created
 * @param {string} channelId (path) The id of the channel
 * @version 1.3
 **/
export interface CreateChannelContentParams extends MutationParams {
  content: ChannelContentCreateInputs;
  channelId: string;
}

export const CreateChannelContent = async ({
  content,
  channelId,
  adminApiParams,
  queryClient,
}: CreateChannelContentParams): Promise<
  ConnectedXMResponse<ChannelContent>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<ChannelContent>>(
    `/channels/${channelId}/contents`,
    content
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_SUBSCRIBERS_QUERY_KEY(channelId),
    });
    SET_CHANNEL_CONTENT_QUERY_DATA(
      queryClient,
      [channelId, data?.data.id],
      data
    );
  }
  return data;
};

export const useCreateChannelContent = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateChannelContent>>,
      Omit<CreateChannelContentParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateChannelContentParams,
    Awaited<ReturnType<typeof CreateChannelContent>>
  >(CreateChannelContent, options, {
    domain: "channels",
    type: "update",
  });
};
