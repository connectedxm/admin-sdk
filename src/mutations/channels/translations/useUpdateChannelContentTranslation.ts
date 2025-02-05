import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ChannelContentTranslationUpdateInputs } from "@src/params";
import {
  CHANNEL_CONTENT_TRANSLATIONS_QUERY_KEY,
  SET_CHANNEL_CONTENT_TRANSLATION_QUERY_DATA,
} from "@src/queries/channels";

/**
 * Updates the translation of a specific channel content for a given locale.
 * This function allows for updating the translation details of a channel's content, 
 * enabling localization and content management within different languages.
 * It is designed to be used in applications that require dynamic content translation updates.
 * @name UpdateChannelContentTranslation
 * @param {string} channelId - The ID of the channel
 * @param {string} contentId - The ID of the content
 * @param {ISupportedLocale} locale - The locale for the translation
 * @param {ChannelContentTranslationUpdateInputs} contentTranslation - The translation details to update
 * @version 1.2
 **/

export interface UpdateChannelContentTranslationParams extends MutationParams {
  channelId: string;
  contentId: string;
  locale: ISupportedLocale;
  contentTranslation: ChannelContentTranslationUpdateInputs;
}

export const UpdateChannelContentTranslation = async ({
  channelId,
  contentId,
  contentTranslation,
  locale,
  adminApiParams,
  queryClient,
}: UpdateChannelContentTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put(
    `/channels/${channelId}/contents/${contentId}/translations/${locale}`,
    contentTranslation
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENT_TRANSLATIONS_QUERY_KEY(channelId, contentId),
    });
    SET_CHANNEL_CONTENT_TRANSLATION_QUERY_DATA(
      queryClient,
      [channelId, contentId, data?.locale],
      data
    );
  }
  return data;
};

export const useUpdateChannelContentTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateChannelContentTranslation>>,
      Omit<
        UpdateChannelContentTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateChannelContentTranslationParams,
    Awaited<ReturnType<typeof UpdateChannelContentTranslation>>
  >(UpdateChannelContentTranslation, options, {
    domain: "channels",
    type: "update",
  });
};

export default useUpdateChannelContentTranslation;