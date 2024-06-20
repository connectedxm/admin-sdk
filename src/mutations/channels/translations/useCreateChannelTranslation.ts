import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, ChannelTranslation } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  CHANNEL_TRANSLATION_QUERY_KEY,
  SET_CHANNEL_TRANSLATION_QUERY_DATA,
} from "@src/queries/channels";

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
  ConnectedXMResponse<ChannelTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<
    ConnectedXMResponse<ChannelTranslation>
  >(`/contentTypes/${contentTypeId}/translations`, {
    locale,
    autoTranslate,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_TRANSLATION_QUERY_KEY(contentTypeId, data?.data.locale),
    });
    SET_CHANNEL_TRANSLATION_QUERY_DATA(
      queryClient,
      [contentTypeId, data?.data.locale],
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
