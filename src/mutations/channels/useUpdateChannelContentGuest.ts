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
 * @category Params
 * @group Channels
 */
export interface UpdateChannelContentGuestParams extends MutationParams {
  contentId: string;
  channelId: string;
  guestId: string;
  contentGuest: ChannelContentGuestUpdateInputs;
}

/**
 * @category Methods
 * @group Channels
 */
export const UpdateChannelContentGuest = async ({
  contentId,
  channelId,
  guestId,
  contentGuest: content,
  adminApiParams,
  queryClient,
}: UpdateChannelContentGuestParams): Promise<
  ConnectedXMResponse<ChannelContentGuest>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put(
    `/channels/${channelId}/contents/${contentId}/guests/${guestId}`,
    content
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

/**
 * @category Mutations
 * @group Channels
 */
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
