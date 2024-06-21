import { GetAdminAPI } from "@src/AdminAPI";
import { ContentTranslation } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  CHANNEL_CONTENT_TRANSLATIONS_QUERY_KEY,
  SET_CHANNEL_CONTENT_TRANSLATION_QUERY_DATA,
} from "@src/queries/channels";

/**
 * @category Params
 * @group Channel-Translation
 */
export interface UpdateChannelContentTranslationParams extends MutationParams {
  contentTypeId: string;
  contentId: string;
  contentTranslation: ContentTranslation;
}

/**
 * @category Methods
 * @group Channel-Translation
 */
export const UpdateChannelContentTranslation = async ({
  contentId,
  contentTypeId,
  contentTranslation,
  adminApiParams,
  queryClient,
}: UpdateChannelContentTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { locale, ...body } = contentTranslation;

  const { data } = await connectedXM.put(
    `/contents/${contentId}/translations/${locale}`,
    body
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENT_TRANSLATIONS_QUERY_KEY(
        contentTypeId,
        contentId
      ),
    });
    SET_CHANNEL_CONTENT_TRANSLATION_QUERY_DATA(
      queryClient,
      [contentTypeId, contentId, data?.locale],
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
    MutationOptions<
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
  >(UpdateChannelContentTranslation, options);
};

export default useUpdateChannelContentTranslation;
