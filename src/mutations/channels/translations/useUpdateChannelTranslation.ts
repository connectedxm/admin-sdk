import { GetAdminAPI } from "@src/AdminAPI";
import { ChannelTranslation, ConnectedXMResponse } from "@src/interfaces";
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
export interface UpdateChannelTranslationParams extends MutationParams {
  contentTypeId: string;
  contentTypeTranslation: ChannelTranslation;
}

/**
 * @category Methods
 * @group Channel-Translation
 */
export const UpdateChannelTranslation = async ({
  contentTypeId,
  contentTypeTranslation,
  adminApiParams,
  queryClient,
}: UpdateChannelTranslationParams): Promise<
  ConnectedXMResponse<ChannelTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { locale, ...body } = contentTypeTranslation;

  const { data } = await connectedXM.put<
    ConnectedXMResponse<ChannelTranslation>
  >(`/contentTypes/${contentTypeId}/translations/${locale}`, body);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_TRANSLATION_QUERY_KEY(contentTypeId, data?.data.locale),
    });
    SET_CHANNEL_TRANSLATION_QUERY_DATA(
      queryClient,
      [contentTypeId, data?.data.id],
      data
    );
  }

  return data;
};

/**
 * @category Mutations
 * @group Channel-Translation
 */
export const useUpdateChannelTranslation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateChannelTranslation>>,
      Omit<UpdateChannelTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateChannelTranslationParams,
    Awaited<ReturnType<typeof UpdateChannelTranslation>>
  >(UpdateChannelTranslation, options);
};
