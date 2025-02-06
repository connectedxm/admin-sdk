import { ConnectedXMResponse, ChannelContentGuest } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  CHANNEL_CONTENT_GUESTS_QUERY_KEY,
  SET_CHANNEL_CONTENT_GUEST_QUERY_DATA,
} from "@src/queries/channels";
import { ChannelContentGuestUpdateInputs } from "@src/params";

/**
 * Endpoint to update a channel content guest.
 * This function allows updating the details of a guest associated with specific content in a channel.
 * It is used to modify guest information such as permissions or roles within the context of channel content.
 * @name UpdateChannelContentGuest
 * @param {string} contentId (path) - The id of the content
 * @param {string} channelId (path) - The id of the channel
 * @param {string} guestId (path) - The id of the guest
 * @param {ChannelContentGuestUpdateInputs} contentGuest (body) - The content guest update inputs
 * @version 1.3
 **/
export interface UpdateChannelContentGuestParams extends MutationParams {
  contentId: string;
  channelId: string;
  guestId: string;
  contentGuest: ChannelContentGuestUpdateInputs;
}

export const UpdateChannelContentGuest = async ({
  contentId,
  channelId,
  guestId,
  contentGuest,
  adminApiParams,
  queryClient,
}: UpdateChannelContentGuestParams): Promise<
  ConnectedXMResponse<ChannelContentGuest>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put(
    `/channels/${channelId}/contents/${contentId}/guests/${guestId}`,
    contentGuest
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENT_GUESTS_QUERY_KEY(channelId, contentId),
    });
    SET_CHANNEL_CONTENT_GUEST_QUERY_DATA(
      queryClient,
      [channelId, contentId, guestId],
      data
    );
  }
  return data;
};

export const useUpdateChannelContentGuest = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateChannelContentGuest>>,
      Omit<UpdateChannelContentGuestParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateChannelContentGuestParams,
    Awaited<ReturnType<typeof UpdateChannelContentGuest>>
  >(UpdateChannelContentGuest, options, {
    domain: "channels",
    type: "update",
  });
};
