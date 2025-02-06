import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, FaqSectionTranslation } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_FAQ_SECTION_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * Creates a new translation for a specific FAQ section within an event.
 * This function allows for the addition of a translation to an FAQ section, supporting multiple locales and optional auto-translation.
 * It is designed to be used in applications where multilingual support for event FAQs is required.
 * @name PostEventFaqSectionTranslation
 * @param {string} eventId (path) The ID of the event
 * @param {string} sectionId (path) The ID of the FAQ section
 * @param {string} locale (bodyValue) The locale for the translation
 * @param {boolean} [autoTranslate] (bodyValue) Whether to automatically translate the content
 * @version 1.3
 **/

/**
 * @category Params
 * @group Event-Faqs-Translations
 */
export interface CreateEventFaqSectionTranslationParams extends MutationParams {
  eventId: string;
  sectionId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Event-Faqs-Translations
 */
export const CreateEventFaqSectionTranslation = async ({
  eventId,
  sectionId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventFaqSectionTranslationParams): Promise<
  ConnectedXMResponse<FaqSectionTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<
    ConnectedXMResponse<FaqSectionTranslation>
  >(`/events/${eventId}/faqs/${sectionId}/translations`, {
    locale,
    autoTranslate,
  });

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
export const useCreateEventFaqSectionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventFaqSectionTranslation>>,
      Omit<
        CreateEventFaqSectionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventFaqSectionTranslationParams,
    Awaited<ReturnType<typeof CreateEventFaqSectionTranslation>>
  >(CreateEventFaqSectionTranslation, options, {
    domain: "events",
    type: "update",
  });
};
