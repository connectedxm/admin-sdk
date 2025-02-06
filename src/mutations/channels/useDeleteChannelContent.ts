import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  CHANNEL_SUBSCRIBERS_QUERY_KEY,
  CHANNEL_CONTENT_QUERY_KEY,
} from "@src/queries/channels";

/**
 * Endpoint to delete content from a specified channel.
 * This function allows for the removal of content from a channel by specifying the content and channel IDs.
 * It is useful in scenarios where content needs to be managed or moderated within a channel.
 * @name DeleteChannelContent
 * @param {string} contentId (path) - The id of the content to be deleted
 * @param {string} channelId (path) - The id of the channel from which the content will be deleted
 * @version 1.3
 **/
export interface DeleteChannelContentParams extends MutationParams {
  contentId: string;
  channelId: string;
}

export const DeleteChannelContent = async ({
  contentId,
  channelId,
  adminApiParams,
  queryClient,
}: DeleteChannelContentParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/channels/${channelId}/contents/${contentId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_SUBSCRIBERS_QUERY_KEY(channelId),
    });
    queryClient.removeQueries({
      queryKey: CHANNEL_CONTENT_QUERY_KEY(channelId, contentId),
    });
  }
  return data;
};

export const useDeleteChannelContent = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteChannelContent>>,
      Omit<DeleteChannelContentParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteChannelContentParams,
    Awaited<ReturnType<typeof DeleteChannelContent>>
  >(DeleteChannelContent, options, {
    domain: "channels",
    type: "update",
  });
};