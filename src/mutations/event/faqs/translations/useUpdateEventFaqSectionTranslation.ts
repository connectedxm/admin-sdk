import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventFaqSectionTranslationUpdateInputs } from "@src/params";
import {
  EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_FAQ_SECTION_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * Updates the translation of a specific FAQ section within an event.
 * This function allows for modifying the translation details of a FAQ section for a given event and locale.
 * It is designed to be used in applications where event FAQ translations need to be updated.
 * @name UpdateEventFaqSectionTranslation
 * @param {string} eventId (path) - The ID of the event
 * @param {string} sectionId (path) - The ID of the FAQ section
 * @param {ISupportedLocale} locale (path) - The locale for the translation
 * @param {EventFaqSectionTranslationUpdateInputs} faqSectionTranslation (body) - The translation inputs for the FAQ section
 * @version 1.3
 **/

/**
 * @category Params
 * @group Event-Faqs-Translations
 */
export interface UpdateEventFaqSectionTranslationParams extends MutationParams {
  eventId: string;
  sectionId: string;
  locale: ISupportedLocale;
  faqSectionTranslation: EventFaqSectionTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Faqs-Translations
 */
export const UpdateEventFaqSectionTranslation = async ({
  eventId,
  sectionId,
  locale,
  faqSectionTranslation,
  adminApiParams,
  queryClient,
}: UpdateEventFaqSectionTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put(
    `/events/${eventId}/faqs/${sectionId}/translations/${locale}`,
    faqSectionTranslation
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY(eventId, sectionId),
    });

    SET_EVENT_FAQ_SECTION_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, sectionId, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Faqs-Translations
 */
export const useUpdateEventFaqSectionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventFaqSectionTranslation>>,
      Omit<
        UpdateEventFaqSectionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventFaqSectionTranslationParams,
    Awaited<ReturnType<typeof UpdateEventFaqSectionTranslation>>
  >(UpdateEventFaqSectionTranslation, options, {
    domain: "events",
    type: "update",
  });
};