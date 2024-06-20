import { GetAdminAPI } from "@src/AdminAPI";
import { ContentTranslation } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";

/**
 * @category Params
 * @group Content-Translation
 */
export interface UpdateContentTypeContentTranslationParams
  extends MutationParams {
  contentTypeId: string;
  contentId: string;
  contentTranslation: ContentTranslation;
}

/**
 * @category Methods
 * @group Content-Translation
 */
export const UpdateContentTypeContentTranslation = async ({
  contentId,
  contentTypeId,
  contentTranslation,
  adminApiParams,
  queryClient,
}: UpdateContentTypeContentTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { locale, ...body } = contentTranslation;

  const { data } = await connectedXM.put(
    `/contents/${contentId}/translations/${locale}`,
    body
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CONTENT_TYPE_CONTENT_TRANSLATIONS_QUERY_KEY(
        contentTypeId,
        contentId
      ),
    });
    SET_CONTENT_TYPE_CONTENT_TRANSLATION_QUERY_DATA(
      queryClient,
      [contentTypeId, contentId, data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Content-Translation
 */
export const useUpdateContentTypeContentTranslation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateContentTypeContentTranslation>>,
      Omit<
        UpdateContentTypeContentTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateContentTypeContentTranslationParams,
    Awaited<ReturnType<typeof UpdateContentTypeContentTranslation>>
  >(UpdateContentTypeContentTranslation, options);
};

export default useUpdateContentTypeContentTranslation;
