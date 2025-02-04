import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionTranslationUpdateInputs } from "@src/params";
import {
  EVENT_SESSION_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_SESSION_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * Updates the translation for a specific event session.
 * This function allows updating the translation details of a session within an event for a specified locale.
 * It is designed to be used in applications where multilingual support for event sessions is required.
 * @name UpdateEventSessionTranslation
 * @param {string} eventId - The ID of the event
 * @param {string} sessionId - The ID of the session
 * @param {EventSessionTranslationUpdateInputs} sessionTranslation - The translation details to update
 * @param {ISupportedLocale} locale - The locale for the translation
 * @version 1.2
 **/

export interface UpdateEventSessionTranslationParams extends MutationParams {
  eventId: string;
  sessionId: string;
  locale: ISupportedLocale;
  sessionTranslation: EventSessionTranslationUpdateInputs;
}

export const UpdateEventSessionTranslation = async ({
  eventId,
  sessionId,
  sessionTranslation,
  locale,
  adminApiParams,
  queryClient,
}: UpdateEventSessionTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put(
    `/events/${eventId}/sessions/${sessionId}/translations/${locale}`,
    sessionTranslation
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_TRANSLATIONS_QUERY_KEY(eventId, sessionId),
    });
    SET_EVENT_SESSION_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, sessionId, data.data?.locale],
      data
    );
  }
  return data;
};

export const useUpdateEventSessionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSessionTranslation>>,
      Omit<
        UpdateEventSessionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionTranslationParams,
    Awaited<ReturnType<typeof UpdateEventSessionTranslation>>
  >(UpdateEventSessionTranslation, options, {
    domain: "events",
    type: "update",
  });
};