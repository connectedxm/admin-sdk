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
 * @category Params
 * @group Channel
 */
export interface DeleteChannelContentGuestParams extends MutationParams {
  contentId: string;
  channelId: string;
  guestId: string;
}

/**
 * @category Methods
 * @group Channel
 */
export const DeleteChannelContentGuest = async ({
  contentId,
  guestId,
  channelId,
  adminApiParams,
  queryClient,
}: DeleteChannelContentGuestParams): Promise<
  ConnectedXMResponse<ChannelContent>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<
    ConnectedXMResponse<ChannelContent>
  >(`/channels/${channelId}/contents/${contentId}/guests/${guestId}`);

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

/**
 * @category Mutations
 * @group Channel
 */
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
