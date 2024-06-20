import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, ContentTranslation } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";

/**
 * @category Params
 * @group Content-Translation
 */
export interface CreateContentTypeContentTranslationParams
  extends MutationParams {
  contentTypeId: string;
  contentId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Content-Translation
 */
export const CreateContentTypeContentTranslation = async ({
  contentId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
  contentTypeId,
}: CreateContentTypeContentTranslationParams): Promise<
  ConnectedXMResponse<ContentTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post(
    `/contents/${contentId}/translations`,
    {
      locale,
      autoTranslate,
    }
  );

  if (queryClient && data.status === "ok") {
    //BOTH OF THESE FUNCTIONS ARE NOT DEFINED
    queryClient.invalidateQueries({
      queryKey: CONTENT_TYPE_CONTENT_TRANSLATIONS_QUERY_KEY(
        contentTypeId,
        contentId
      ),
    });
    SET_CONTENT_TYPE_CONTENT_TRANSLATION_QUERY_DATA(queryClient, [
      contentTypeId,
      contentId,
      data?.locale,
    ]);
  }
  return data;
};

/**
 * @category Mutations
 * @group Content-Translation
 */
export const useCreateContentTypeContentTranslation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateContentTypeContentTranslation>>,
      Omit<
        CreateContentTypeContentTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateContentTypeContentTranslationParams,
    Awaited<ReturnType<typeof CreateContentTypeContentTranslation>>
  >(CreateContentTypeContentTranslation, options);
};
