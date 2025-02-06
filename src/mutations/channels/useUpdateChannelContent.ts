import { ConnectedXMResponse, ChannelContent } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  CHANNEL_CONTENT_QUERY_KEY,
  SET_CHANNEL_CONTENT_QUERY_DATA,
} from "@src/queries/channels";
import { ChannelContentUpdateInputs } from "@src/params";

/**
 * Endpoint to update the content of a specified channel.
 * This function allows updating the details of a channel's content by providing the content ID, channel ID, and the new content inputs.
 * It is designed for applications that need to modify existing channel content.
 * @name UpdateChannelContent
 * @param {string} contentId (path) The id of the content
 * @param {ChannelContentUpdateInputs} content (body) The content update inputs
 * @param {string} channelId (path) The id of the channel
 * @version 1.3
 **/
export interface UpdateChannelContentParams extends MutationParams {
  contentId: string;
  content: ChannelContentUpdateInputs;
  channelId: string;
}

export const UpdateChannelContent = async ({
  contentId,
  channelId,
  content,
  adminApiParams,
  queryClient,
}: UpdateChannelContentParams): Promise<
  ConnectedXMResponse<ChannelContent>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put(
    `/channels/${channelId}/contents/${contentId}`,
    content
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENT_QUERY_KEY(channelId, contentId),
    });
    SET_CHANNEL_CONTENT_QUERY_DATA(queryClient, [channelId, contentId], data);
  }
  return data;
};

export const useUpdateChannelContent = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateChannelContent>>,
      Omit<UpdateChannelContentParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateChannelContentParams,
    Awaited<ReturnType<typeof UpdateChannelContent>>
  >(UpdateChannelContent, options, {
    domain: "channels",
    type: "update",
  });
};
