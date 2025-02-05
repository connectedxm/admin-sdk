import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  RegistrationSectionTranslation,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SECTION_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_SECTION_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * Creates a new translation for a specific event section.
 * This function allows the creation of a translation for a given event section by specifying the event ID, section ID, and locale.
 * It supports optional auto-translation and updates the query cache upon successful creation.
 * @name PostEventSectionTranslation
 * @param {string} eventId - The ID of the event
 * @param {string} sectionId - The ID of the section
 * @param {string} locale - The locale for the translation
 * @param {[boolean]} autoTranslate - Whether to automatically translate the section
 * @version 1.2
 **/

/**
 * @category Params
 * @group Event-Sections-Translations
 */
export interface CreateEventSectionTranslationParams extends MutationParams {
  eventId: string;
  sectionId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Event-Sections-Translations
 */
export const CreateEventSectionTranslation = async ({
  eventId,
  sectionId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventSectionTranslationParams): Promise<
  ConnectedXMResponse<RegistrationSectionTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<
    ConnectedXMResponse<RegistrationSectionTranslation>
  >(`/events/${eventId}/sections/${sectionId}/translations`, {
    locale,
    autoTranslate,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SECTION_TRANSLATIONS_QUERY_KEY(eventId, sectionId),
    });
    SET_EVENT_SECTION_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, sectionId, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sections-Translations
 */
export const useCreateEventSectionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventSectionTranslation>>,
      Omit<
        CreateEventSectionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSectionTranslationParams,
    Awaited<ReturnType<typeof CreateEventSectionTranslation>>
  >(CreateEventSectionTranslation, options, {
    domain: "events",
    type: "update",
  });
};