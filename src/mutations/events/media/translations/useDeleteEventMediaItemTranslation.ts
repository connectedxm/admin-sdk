import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_MEDIA_ITEM_TRANSLATIONS_QUERY_KEY,
  EVENT_MEDIA_ITEM_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Media-Translations
 */
export interface DeleteEventMediaItemTranslationParams extends MutationParams {
  eventId: string;
  mediaId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-Media-Translations
 */
export const DeleteEventMediaItemTranslation = async ({
  eventId,
  mediaId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventMediaItemTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/events/${eventId}/media/${mediaId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_MEDIA_ITEM_TRANSLATIONS_QUERY_KEY(eventId, mediaId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_MEDIA_ITEM_TRANSLATION_QUERY_KEY(
        eventId,
        mediaId,
        locale
      ),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Event-Media-Translations
 */
export const useDeleteEventMediaItemTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventMediaItemTranslation>>,
      Omit<
        DeleteEventMediaItemTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventMediaItemTranslationParams,
    Awaited<ReturnType<typeof DeleteEventMediaItemTranslation>>
  >(DeleteEventMediaItemTranslation, options);
};
