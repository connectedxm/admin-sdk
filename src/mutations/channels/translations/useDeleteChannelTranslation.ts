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
 * Deletes a specific channel translation for a given channel and locale.
 * This function is used to remove translations associated with a channel, identified by channel ID and locale.
 * It ensures that the translation data is invalidated in the query cache upon successful deletion.
 * @name DeleteChannelTranslation
 * @param {string} channelId (path) The ID of the channel
 * @param {string} locale (path) The locale of the translation to be deleted
 * @version 1.3
 **/

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
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete(
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
    domain: "channels",
    type: "update",
  });
};
