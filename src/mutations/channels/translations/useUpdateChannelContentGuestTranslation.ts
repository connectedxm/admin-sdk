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
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<
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
    domain: "contents",
    type: "update",
  });
};

export default useUpdateChannelContentGuestTranslation;
