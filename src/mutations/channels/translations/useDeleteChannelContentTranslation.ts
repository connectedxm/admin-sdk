import { GetAdminAPI } from "@src/AdminAPI";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  CHANNEL_CONTENT_TRANSLATIONS_QUERY_KEY,
  CHANNEL_CONTENT_TRANSLATION_QUERY_KEY,
} from "@src/queries/channels";

/**
 * @category Params
 * @group Content-Translation
 */
export interface DeleteContentTypeContentTranslationParams
  extends MutationParams {
  contentId: string;
  contentTypeId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Content-Translation
 */
export const DeleteContentTypeContentTranslation = async ({
  contentId,
  contentTypeId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteContentTypeContentTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/contents/${contentId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENT_TRANSLATIONS_QUERY_KEY(
        contentTypeId,
        contentId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENT_TRANSLATION_QUERY_KEY(
        contentTypeId,
        contentId,
        locale
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Content-Translation
 */
export const useDeleteContentTypeContentTranslation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteContentTypeContentTranslation>>,
      Omit<
        DeleteContentTypeContentTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteContentTypeContentTranslationParams,
    Awaited<ReturnType<typeof DeleteContentTypeContentTranslation>>
  >(DeleteContentTypeContentTranslation, options);
};
