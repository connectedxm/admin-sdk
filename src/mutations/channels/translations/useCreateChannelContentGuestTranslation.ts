import { GetAdminAPI } from "@src/AdminAPI";
import {
  ChannelContentGuestTranslation,
  ConnectedXMResponse,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SET_CHANNEL_CONTENT_GUEST_TRANSLATION_QUERY_DATA } from "@src/queries/channels/translations/useGetChannelContentGuestTranslation";
import { CHANNEL_CONTENT_GUEST_TRANSLATIONS_QUERY_KEY } from "@src/queries/channels/translations/useGetChannelContentGuestTranslations";

/**
 * Creates a translation for a specific guest's content within a channel.
 * This function allows for the creation of a guest translation for a specific content item in a channel, 
 * supporting optional auto-translation. It is useful for applications that need to manage multilingual content 
 * for different guests within a channel.
 * @name PostChannelContentGuestTranslation
 * @param {string} channelId - The ID of the channel
 * @param {string} contentId - The ID of the content
 * @param {string} guestId - The ID of the guest
 * @param {string} locale - The locale for the translation
 * @param {[boolean]} autoTranslate - Whether to automatically translate the content
 * @version 1.2
 **/

/**
 * @category Params
 * @group Channel-Translation
 */
export interface CreateChannelContentGuestTranslationParams
  extends MutationParams {
  channelId: string;
  contentId: string;
  guestId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Channel-Translation
 */
export const CreateChannelContentGuestTranslation = async ({
  channelId,
  contentId,
  guestId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateChannelContentGuestTranslationParams): Promise<
  ConnectedXMResponse<ChannelContentGuestTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<
    ConnectedXMResponse<ChannelContentGuestTranslation>
  >(
    `/channels/${channelId}/contents/${contentId}/guests/${guestId}/translations`,
    {
      locale,
      autoTranslate,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENT_GUEST_TRANSLATIONS_QUERY_KEY(
        channelId,
        contentId,
        guestId
      ),
    });
    SET_CHANNEL_CONTENT_GUEST_TRANSLATION_QUERY_DATA(
      queryClient,
      [channelId, contentId, guestId, data?.data.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Channel-Translation
 */
export const useCreateChannelContentGuestTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateChannelContentGuestTranslation>>,
      Omit<
        CreateChannelContentGuestTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateChannelContentGuestTranslationParams,
    Awaited<ReturnType<typeof CreateChannelContentGuestTranslation>>
  >(CreateChannelContentGuestTranslation, options, {
    domain: "channels",
    type: "update",
  });
};