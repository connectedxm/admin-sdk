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
 * @category Params
 * @group Channel-Translation
 */
export interface UpdateChannelContentTranslationParams extends MutationParams {
  channelId: string;
  contentId: string;
  locale: ISupportedLocale;
  contentTranslation: ChannelContentTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Channel-Translation
 */
export const UpdateChannelContentTranslation = async ({
  channelId,
  contentId,
  contentTranslation,
  locale,
  adminApiParams,
  queryClient,
}: UpdateChannelContentTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put(
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

/**
 * @category Mutations
 * @group Channel-Translation
 */
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
    domain: "contents",
    type: "update",
  });
};

export default useUpdateChannelContentTranslation;
