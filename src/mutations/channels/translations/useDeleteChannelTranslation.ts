import { GetAdminAPI } from "@src/AdminAPI";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  CHANNEL_TRANSLATIONS_QUERY_KEY,
  CHANNEL_TRANSLATION_QUERY_KEY,
} from "@src/queries/channels";

/**
 * @category Params
 * @group Channel-Translation
 */
export interface DeleteChannelTranslationParams extends MutationParams {
  contentTypeId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Channel-Translation
 */
export const DeleteChannelTranslation = async ({
  contentTypeId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteChannelTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/contentTypes/${contentTypeId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_TRANSLATIONS_QUERY_KEY(contentTypeId),
    });
    queryClient.invalidateQueries({
      queryKey: CHANNEL_TRANSLATION_QUERY_KEY(contentTypeId, locale),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Channel-Translation
 */
export const useDeleteChannelTranslation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteChannelTranslation>>,
      Omit<DeleteChannelTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation(DeleteChannelTranslation, options);
};
