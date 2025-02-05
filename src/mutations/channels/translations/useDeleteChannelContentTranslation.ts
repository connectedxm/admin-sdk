import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  CHANNEL_CONTENT_TRANSLATIONS_QUERY_KEY,
  CHANNEL_CONTENT_TRANSLATION_QUERY_KEY,
} from "@src/queries/channels";

/**
 * Deletes a specific translation of channel content by its content ID, channel ID, and locale.
 * This function is used to remove a translation from a channel's content, ensuring that the specified translation is no longer available.
 * It is designed for applications that manage multilingual content within channels.
 * @name DeleteChannelContentTranslation
 * @param {string} contentId - The ID of the content
 * @param {string} channelId - The ID of the channel
 * @param {string} locale - The locale of the translation
 * @version 1.2
 **/

/**
 * @category Params
 * @group Channel-Translation
 */
export interface DeleteChannelContentTranslationParams extends MutationParams {
  contentId: string;
  channelId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Channel-Translation
 */
export const DeleteChannelContentTranslation = async ({
  channelId,
  contentId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteChannelContentTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete(
    `/channels/${channelId}/contents/${contentId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENT_TRANSLATIONS_QUERY_KEY(channelId, contentId),
    });
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENT_TRANSLATION_QUERY_KEY(
        channelId,
        contentId,
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
export const useDeleteChannelContentTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteChannelContentTranslation>>,
      Omit<
        DeleteChannelContentTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteChannelContentTranslationParams,
    Awaited<ReturnType<typeof DeleteChannelContentTranslation>>
  >(DeleteChannelContentTranslation, options, {
    domain: "channels",
    type: "update",
  });
};