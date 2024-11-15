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
import { ChannelContentGuestCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Channels
 */
export interface CreateChannelContentGuestParams extends MutationParams {
  contentId: string;
  channelId: string;
  contentGuest: ChannelContentGuestCreateInputs;
}

/**
 * @category Methods
 * @group Channels
 */
export const CreateChannelContentGuest = async ({
  contentId,
  channelId,
  contentGuest: content,
  adminApiParams,
  queryClient,
}: CreateChannelContentGuestParams): Promise<
  ConnectedXMResponse<ChannelContentGuest>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<ChannelContentGuest>
  >(`/channels/${channelId}/contents/${contentId}/guests`, content);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENT_GUESTS_QUERY_KEY(channelId, contentId),
    });
    SET_CHANNEL_CONTENT_GUEST_QUERY_DATA(
      queryClient,
      [channelId, contentId, data.data.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Channels
 */
export const useCreateChannelContentGuest = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateChannelContentGuest>>,
      Omit<CreateChannelContentGuestParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateChannelContentGuestParams,
    Awaited<ReturnType<typeof CreateChannelContentGuest>>
  >(CreateChannelContentGuest, options, {
    domain: "channels",
    type: "update",
  });
};
