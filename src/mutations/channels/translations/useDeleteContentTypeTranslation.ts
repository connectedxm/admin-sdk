import { GetAdminAPI } from "@src/AdminAPI";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";

/**
 * @category Params
 * @group Channel-Translation
 */
export interface DeleteContentTypeTranslationParams extends MutationParams {
  contentTypeId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Channel-Translation
 */
export const DeleteContentTypeTranslation = async ({
  contentTypeId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteContentTypeTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/contentTypes/${contentTypeId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CONTENT_TYPE_TRANSLATIONS_QUERY_KEY(contentTypeId),
    });
    queryClient.invalidateQueries({
      queryKey: CONTENT_TYPE_TRANSLATION_QUERY_KEY(contentTypeId, locale),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Channel-Translation
 */
export const useDeleteContentTypeTranslation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteContentTypeTranslation>>,
      Omit<DeleteContentTypeTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation(DeleteContentTypeTranslation, options);
};
