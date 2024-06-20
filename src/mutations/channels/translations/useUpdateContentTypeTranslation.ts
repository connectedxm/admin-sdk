import { GetAdminAPI } from "@src/AdminAPI";
import { ChannelTranslation } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";

/**
 * @category Params
 * @group Content-Translation
 */
export interface UpdateContentTypeTranslationParams extends MutationParams {
  contentTypeId: string;
  contentTypeTranslation: ChannelTranslation;
}

/**
 * @category Methods
 * @group Content-Translation
 */
export const UpdateContentTypeTranslation = async ({
  contentTypeId,
  contentTypeTranslation,
  adminApiParams,
  queryClient,
}: UpdateContentTypeTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { locale, ...body } = contentTypeTranslation;

  const { data } = await connectedXM.put(
    `/contentTypes/${contentTypeId}/translations/${locale}`,
    body
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CONTENT_TYPE_TRANSLATIONS_QUERY_KEY(contentTypeId),
    });
    SET_CONTENT_TYPE_TRANSLATION_QUERY_DATA(
      queryClient,
      [contentTypeId, data?.id],
      data
    );
  }

  return data;
};

/**
 * @category Mutations
 * @group Content-Translation
 */
export const useUpdateContentTypeTranslation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateContentTypeTranslation>>,
      Omit<UpdateContentTypeTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateContentTypeTranslationParams,
    Awaited<ReturnType<typeof UpdateContentTypeTranslation>>
  >(UpdateContentTypeTranslation, options);
};
