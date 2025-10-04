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
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
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
  >(DeleteChannelContentTranslation, options);
};
