import { ConnectedXMResponse, ChannelContent } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  CHANNEL_CONTENT_GUEST_QUERY_KEY,
  CHANNEL_CONTENT_GUESTS_QUERY_KEY,
} from "@src/queries/channels";

/**
 * Endpoint to delete a guest from the specified channel content.
 * This function allows the removal of a guest from a particular content within a channel.
 * It is useful in scenarios where guest access needs to be revoked or managed.
 * @name DeleteChannelContentGuest
 * @param {string} contentId (path) - The id of the content
 * @param {string} channelId (path) - The id of the channel
 * @param {string} guestId (path) - The id of the guest
 * @version 1.3
 **/

export interface DeleteChannelContentGuestParams extends MutationParams {
  contentId: string;
  channelId: string;
  guestId: string;
}

export const DeleteChannelContentGuest = async ({
  contentId,
  guestId,
  channelId,
  adminApiParams,
  queryClient,
}: DeleteChannelContentGuestParams): Promise<
  ConnectedXMResponse<ChannelContent>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<ChannelContent>>(
    `/channels/${channelId}/contents/${contentId}/guests/${guestId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENT_GUESTS_QUERY_KEY(channelId, contentId),
    });
    queryClient.removeQueries({
      queryKey: CHANNEL_CONTENT_GUEST_QUERY_KEY(channelId, contentId, guestId),
    });
  }
  return data;
};

export const useDeleteChannelContentGuest = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteChannelContentGuest>>,
      Omit<DeleteChannelContentGuestParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation(DeleteChannelContentGuest, options, {
    domain: "channels",
    type: "update",
  });
};