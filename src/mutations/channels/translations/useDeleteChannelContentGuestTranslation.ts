import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { CHANNEL_CONTENT_GUEST_TRANSLATION_QUERY_KEY } from "@src/queries/channels/translations/useGetChannelContentGuestTranslation";
import { CHANNEL_CONTENT_GUEST_TRANSLATIONS_QUERY_KEY } from "@src/queries/channels/translations/useGetChannelContentGuestTranslations";

/**
 * Deletes a specific guest translation for channel content.
 * This function is used to remove a translation associated with a guest for a particular piece of content within a channel.
 * It ensures that the translation is deleted from the system and invalidates relevant queries to update the UI accordingly.
 * @name DeleteChannelContentGuestTranslation
 * @param {string} channelId (path) - The ID of the channel
 * @param {string} contentId (path) - The ID of the content
 * @param {string} guestId (path) - The ID of the guest
 * @param {string} locale (path) - The locale of the translation
 * @version 1.3
 **/

/**
 * @category Params
 * @group Channel-Translation
 */
export interface DeleteChannelContentGuestTranslationParams
  extends MutationParams {
  contentId: string;
  channelId: string;
  guestId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Channel-Translation
 */
export const DeleteChannelContentGuestTranslation = async ({
  channelId,
  contentId,
  guestId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteChannelContentGuestTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete(
    `/channels/${channelId}/contents/${contentId}/guests/${guestId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENT_GUEST_TRANSLATIONS_QUERY_KEY(
        channelId,
        contentId,
        guestId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENT_GUEST_TRANSLATION_QUERY_KEY(
        channelId,
        contentId,
        guestId,
        locale
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Channel-Translation
 */
export const useDeleteChannelContentGuestTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteChannelContentGuestTranslation>>,
      Omit<
        DeleteChannelContentGuestTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteChannelContentGuestTranslationParams,
    Awaited<ReturnType<typeof DeleteChannelContentGuestTranslation>>
  >(DeleteChannelContentGuestTranslation, options, {
    domain: "channels",
    type: "update",
  });
};