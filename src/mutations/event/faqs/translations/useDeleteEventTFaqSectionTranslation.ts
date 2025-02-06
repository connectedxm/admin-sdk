import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY,
  EVENT_FAQ_SECTION_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * Deletes a specific FAQ section translation for an event.
 * This function is used to remove a translation of a FAQ section within an event, identified by event ID, section ID, and locale.
 * It ensures that the relevant cache is invalidated to maintain data consistency.
 * @name DeleteEventFaqSectionTranslation
 * @param {string} eventId (path) - The ID of the event
 * @param {string} sectionId (path) - The ID of the FAQ section
 * @param {string} locale (path) - The locale of the translation
 * @version 1.3
 **/

/**
 * @category Params
 * @group Event-Faqs-Translations
 */
export interface DeleteEventFaqSectionTranslationParams extends MutationParams {
  eventId: string;
  sectionId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-Faqs-Translations
 */
export const DeleteEventFaqSectionTranslation = async ({
  eventId,
  sectionId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventFaqSectionTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete(
    `/events/${eventId}/faqs/${sectionId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY(eventId, sectionId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_FAQ_SECTION_TRANSLATION_QUERY_KEY(
        eventId,
        sectionId,
        locale
      ),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Event-Faqs-Translations
 */
export const useDeleteEventFaqSectionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventFaqSectionTranslation>>,
      Omit<
        DeleteEventFaqSectionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventFaqSectionTranslationParams,
    Awaited<ReturnType<typeof DeleteEventFaqSectionTranslation>>
  >(DeleteEventFaqSectionTranslation, options, {
    domain: "events",
    type: "update",
  });
};