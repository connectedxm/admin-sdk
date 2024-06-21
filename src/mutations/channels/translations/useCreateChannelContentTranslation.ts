import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, ContentTranslation } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  CHANNEL_CONTENT_TRANSLATION_QUERY_KEY,
  SET_CHANNEL_CONTENT_TRANSLATION_QUERY_DATA,
} from "@src/queries/channels";

/**
 * @category Params
 * @group Channel-Translation
 */
export interface CreateChannelContentTranslationParams extends MutationParams {
  contentTypeId: string;
  contentId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Channel-Translation
 */
export const CreateChannelContentTranslation = async ({
  contentId,
  locale,
  autoTranslate,
  contentTypeId,
  adminApiParams,
  queryClient,
}: CreateChannelContentTranslationParams): Promise<
  ConnectedXMResponse<ContentTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<
    ConnectedXMResponse<ContentTranslation>
  >(`/contents/${contentId}/translations`, {
    locale,
    autoTranslate,
  });

  if (queryClient && data.status === "ok") {
    //BOTH OF THESE FUNCTIONS ARE NOT DEFINED
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENT_TRANSLATION_QUERY_KEY(
        contentTypeId,
        contentId,
        data?.data.locale
      ),
    });
    SET_CHANNEL_CONTENT_TRANSLATION_QUERY_DATA(
      queryClient,
      [contentTypeId, contentId, data?.data.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Channel-Translation
 */
export const useCreateChannelContentTranslation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateChannelContentTranslation>>,
      Omit<
        CreateChannelContentTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateChannelContentTranslationParams,
    Awaited<ReturnType<typeof CreateChannelContentTranslation>>
  >(CreateChannelContentTranslation, options);
};
