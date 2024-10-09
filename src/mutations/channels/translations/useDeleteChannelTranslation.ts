import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
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
  channelId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Channel-Translation
 */
export const DeleteChannelTranslation = async ({
  channelId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteChannelTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/channels/${channelId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_TRANSLATIONS_QUERY_KEY(channelId),
    });
    queryClient.invalidateQueries({
      queryKey: CHANNEL_TRANSLATION_QUERY_KEY(channelId, locale),
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
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteChannelTranslation>>,
      Omit<DeleteChannelTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation(DeleteChannelTranslation, options, {
    domain: "contents",
    type: "update",
  });
};
