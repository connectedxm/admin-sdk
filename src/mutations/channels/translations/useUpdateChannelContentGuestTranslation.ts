import { GetAdminAPI } from "@src/AdminAPI";
import {
  ChannelContentGuestTranslation,
  ConnectedXMResponse,
  ISupportedLocale,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ChannelContentGuestTranslationUpdateInputs } from "@src/params";
import { SET_CHANNEL_CONTENT_GUEST_TRANSLATION_QUERY_DATA } from "@src/queries/channels/translations/useGetChannelContentGuestTranslation";
import { CHANNEL_CONTENT_GUEST_TRANSLATIONS_QUERY_KEY } from "@src/queries/channels/translations/useGetChannelContentGuestTranslations";

/**
 * Updates the translation of a guest's content within a specific channel.
 * This function allows for modifying the translation details of a guest's content in a specified locale.
 * It is useful for applications that need to manage multilingual content for guests in different channels.
 * @name UpdateChannelContentGuestTranslation
 * @param {string} channelId - The ID of the channel
 * @param {string} contentId - The ID of the content
 * @param {string} guestId - The ID of the guest
 * @param {ISupportedLocale} locale - The locale for the translation
 * @param {ChannelContentGuestTranslationUpdateInputs} guestTranslation - The translation inputs for the guest content
 * @version 1.2
 **/

/**
 * @category Params
 * @group Channel-Translation
 */
export interface UpdateChannelContentGuestTranslationParams
  extends MutationParams {
  channelId: string;
  contentId: string;
  guestId: string;
  locale: ISupportedLocale;
  guestTranslation: ChannelContentGuestTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Channel-Translation
 */
export const UpdateChannelContentGuestTranslation = async ({
  channelId,
  contentId,
  guestId,
  guestTranslation,
  locale,
  adminApiParams,
  queryClient,
}: UpdateChannelContentGuestTranslationParams): Promise<
  ConnectedXMResponse<ChannelContentGuestTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put<
    ConnectedXMResponse<ChannelContentGuestTranslation>
  >(
    `/channels/${channelId}/contents/${contentId}/guests/${guestId}/translations/${locale}`,
    guestTranslation
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
      [channelId, contentId, guestId, data.data.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Channel-Translation
 */
export const useUpdateChannelContentGuestTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateChannelContentGuestTranslation>>,
      Omit<
        UpdateChannelContentGuestTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateChannelContentGuestTranslationParams,
    Awaited<ReturnType<typeof UpdateChannelContentGuestTranslation>>
  >(UpdateChannelContentGuestTranslation, options, {
    domain: "channels",
    type: "update",
  });
};

export default useUpdateChannelContentGuestTranslation;