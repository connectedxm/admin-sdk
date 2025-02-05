import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_TRANSLATIONS_QUERY_KEY,
  EVENT_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * Deletes a specific event translation for a given event ID and locale.
 * This function is used to remove translations associated with an event, ensuring that the event's translation data is up-to-date.
 * It also invalidates the relevant queries in the query client to maintain data consistency.
 * @name DeleteEventTranslation
 * @param {string} eventId - The ID of the event
 * @param {string} locale - The locale of the translation to be deleted
 * @version 1.2
 */

export interface DeleteEventTranslationParams extends MutationParams {
  eventId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-Translations
 */
export const DeleteEventTranslation = async ({
  eventId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete(
    `/events/${eventId}/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_TRANSLATIONS_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_TRANSLATION_QUERY_KEY(eventId, locale),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Translations
 */
export const useDeleteEventTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventTranslation>>,
      Omit<DeleteEventTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventTranslationParams,
    Awaited<ReturnType<typeof DeleteEventTranslation>>
  >(DeleteEventTranslation, options, {
    domain: "events",
    type: "update",
  });
};