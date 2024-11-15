import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { CHANNEL_CONTENT_GUEST_TRANSLATION_QUERY_KEY } from "@src/queries/channels/translations/useGetChannelContentGuestTranslation";
import { CHANNEL_CONTENT_GUEST_TRANSLATIONS_QUERY_KEY } from "@src/queries/channels/translations/useGetChannelContentGuestTranslations";

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
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
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
