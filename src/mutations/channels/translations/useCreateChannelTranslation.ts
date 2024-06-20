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
 * @group Channel-Translation
 */
export interface CreateChannelTranslationParams extends MutationParams {
  contentTypeId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Channel-Translation
 */
export const CreateContentTypeTranslation = async ({
  contentTypeId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateChannelTranslationParams): Promise<
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
 * @group Channel-Translation
 */
export const useCreateContentTypeTranslation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateContentTypeTranslation>>,
      Omit<CreateChannelTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateChannelTranslationParams,
    Awaited<ReturnType<typeof CreateContentTypeTranslation>>
  >(CreateContentTypeTranslation, options);
};
