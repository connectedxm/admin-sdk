import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSectionTranslationUpdateInputs } from "@src/params";
import {
  EVENT_SECTION_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_SECTION_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * Updates the translation for a specific event section in a given locale.
 * This function allows for updating the translation details of a specific section within an event,
 * identified by eventId and sectionId, for a specified locale. It is designed to be used in applications
 * that manage multilingual content for events.
 * @name UpdateEventSectionTranslation
 * @param {string} eventId (path) The ID of the event
 * @param {string} sectionId (path) The ID of the section within the event
 * @param {ISupportedLocale} locale (path) The locale for which the translation is being updated
 * @param {EventSectionTranslationUpdateInputs} sectionTranslation (body) The translation inputs for the section
 * @version 1.3
 */

export interface UpdateEventSectionTranslationParams extends MutationParams {
  eventId: string;
  sectionId: string;
  locale: ISupportedLocale;
  sectionTranslation: EventSectionTranslationUpdateInputs;
}

export const UpdateEventSectionTranslation = async ({
  eventId,
  sectionId,
  sectionTranslation,
  locale,
  adminApiParams,
  queryClient,
}: UpdateEventSectionTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put(
    `/events/${eventId}/sections/${sectionId}/translations/${locale}`,
    sectionTranslation
  );
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

export const useUpdateEventSectionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSectionTranslation>>,
      Omit<
        UpdateEventSectionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSectionTranslationParams,
    Awaited<ReturnType<typeof UpdateEventSectionTranslation>>
  >(UpdateEventSectionTranslation, options, {
    domain: "events",
    type: "update",
  });
};
