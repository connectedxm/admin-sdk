import { GetAdminAPI } from "@src/AdminAPI";
import {
  EventMediaItemTranslation,
  ConnectedXMResponse,
  ISupportedLocale,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventMediaItemTranslationUpdateInputs } from "@src/params";
import {
  EVENT_MEDIA_ITEM_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_MEDIA_ITEM_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Media-Translations
 */
export interface UpdateEventMediaItemTranslationParams extends MutationParams {
  eventId: string;
  mediaId: string;
  locale: ISupportedLocale;
  eventMediaItemTranslation: EventMediaItemTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Media-Translations
 */
export const UpdateEventMediaItemTranslation = async ({
  eventId,
  mediaId,
  eventMediaItemTranslation,
  locale,
  adminApiParams,
  queryClient,
}: UpdateEventMediaItemTranslationParams): Promise<
  ConnectedXMResponse<EventMediaItemTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<
    ConnectedXMResponse<EventMediaItemTranslation>
  >(
    `/events/${eventId}/media/${mediaId}/translations/${locale}`,
    eventMediaItemTranslation
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_MEDIA_ITEM_TRANSLATIONS_QUERY_KEY(eventId, mediaId),
    });
    SET_EVENT_MEDIA_ITEM_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, mediaId, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Media-Translations
 */
export const useUpdateEventMediaItemTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventMediaItemTranslation>>,
      Omit<
        UpdateEventMediaItemTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventMediaItemTranslationParams,
    Awaited<ReturnType<typeof UpdateEventMediaItemTranslation>>
  >(UpdateEventMediaItemTranslation, options);
};
