import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_TRANSLATIONS_QUERY_KEY,
  EVENT_SESSION_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * Deletes a specific translation for an event session.
 * This function allows the removal of a translation associated with a particular event session, identified by event ID, session ID, and locale.
 * It is useful in scenarios where translations need to be managed or removed from event sessions.
 * @name DeleteEventSessionTranslation
 * @param {string} eventId - The ID of the event
 * @param {string} sessionId - The ID of the session
 * @param {string} locale - The locale of the translation
 * @version 1.2
 **/

/**
 * @category Params
 * @group Event-Sessions-Translations
 */
export interface DeleteEventSessionTranslationParams extends MutationParams {
  eventId: string;
  sessionId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-Sessions-Translations
 */
export const DeleteEventSessionTranslation = async ({
  eventId,
  sessionId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventSessionTranslationParams) => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete(
    `/events/${eventId}/sessions/${sessionId}/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_TRANSLATIONS_QUERY_KEY(eventId, sessionId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_TRANSLATION_QUERY_KEY(eventId, sessionId, locale),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sessions-Translations
 */
export const useDeleteEventSessionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSessionTranslation>>,
      Omit<
        DeleteEventSessionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSessionTranslationParams,
    Awaited<ReturnType<typeof DeleteEventSessionTranslation>>
  >(DeleteEventSessionTranslation, options, {
    domain: "events",
    type: "update",
  });
};