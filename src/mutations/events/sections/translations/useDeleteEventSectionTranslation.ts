import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SECTION_TRANSLATIONS_QUERY_KEY,
  EVENT_SECTION_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * Deletes a specific translation for an event section based on the provided event ID, section ID, and locale.
 * This function is used to remove translations from event sections, ensuring that the specified translation is no longer available.
 * It is particularly useful in scenarios where outdated or incorrect translations need to be removed from the system.
 * @name DeleteEventSectionTranslation
 * @param {string} eventId (path) The ID of the event
 * @param {string} sectionId (path) The ID of the section
 * @param {string} locale (path) The locale of the translation
 * @version 1.3
 **/

/**
 * @category Params
 * @group Event-Sections-Translations
 */
export interface DeleteEventSectionTranslationParams extends MutationParams {
  eventId: string;
  sectionId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-Sections-Translations
 */
export const DeleteEventSectionTranslation = async ({
  eventId,
  sectionId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventSectionTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete(
    `/events/${eventId}/sections/${sectionId}/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SECTION_TRANSLATIONS_QUERY_KEY(eventId, sectionId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_SECTION_TRANSLATION_QUERY_KEY(eventId, sectionId, locale),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sections-Translations
 */
export const useDeleteEventSectionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSectionTranslation>>,
      Omit<
        DeleteEventSectionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSectionTranslationParams,
    Awaited<ReturnType<typeof DeleteEventSectionTranslation>>
  >(DeleteEventSectionTranslation, options, {
    domain: "events",
    type: "update",
  });
};
