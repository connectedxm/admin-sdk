import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, ContentTypeTranslation } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";

/**
 * @category Params
 * @group Content-Translation
 */
export interface CreateContentTypeTranslationParams extends MutationParams {
  contentTypeId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Content-Translation
 */
export const CreateContentTypeTranslation = async ({
  contentTypeId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateContentTypeTranslationParams): Promise<
  ConnectedXMResponse<ContentTypeTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post(
    `/contentTypes/${contentTypeId}/translations`,
    {
      locale,
      autoTranslate,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CONTENT_TYPE_TRANSLATIONS_QUERY_KEY(contentTypeId),
    });
    SET_CONTENT_TYPE_TRANSLATION_QUERY_DATA(
      queryClient,
      [contentTypeId, data.locale],
      data
    );
  }

  return data;
};

/**
 * @category Mutations
 * @group Content-Translation
 */
export const useCreateContentTypeTranslation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateContentTypeTranslation>>,
      Omit<CreateContentTypeTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateContentTypeTranslationParams,
    Awaited<ReturnType<typeof CreateContentTypeTranslation>>
  >(CreateContentTypeTranslation, options);
};
