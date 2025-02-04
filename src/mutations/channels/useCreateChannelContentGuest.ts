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
 * Endpoint to create a new guest for a specific channel content.
 * This function allows the creation of a guest associated with a particular channel content by providing the necessary details.
 * It is designed to be used in applications where managing guest access to channel content is required.
 * @name CreateChannelContentGuest
 * @param {string} contentId - The id of the content
 * @param {string} channelId - The id of the channel
 * @param {ChannelContentGuestCreateInputs} contentGuest - The guest details to be created
 * @version 1.2
 **/
export interface CreateChannelContentGuestParams extends MutationParams {
  contentId: string;
  channelId: string;
  contentGuest: ChannelContentGuestCreateInputs;
}

export const CreateChannelContentGuest = async ({
  contentId,
  channelId,
  contentGuest: content,
  adminApiParams,
  queryClient,
}: CreateChannelContentGuestParams): Promise<
  ConnectedXMResponse<ChannelContentGuest>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<
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
}

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