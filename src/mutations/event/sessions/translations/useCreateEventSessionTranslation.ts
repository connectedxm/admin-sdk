import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSessionTranslation } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_SESSION_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * Creates a new translation for a specific event session.
 * This function allows the creation of a translation for an event session by specifying the event ID, session ID, and locale.
 * It supports optional auto-translation and updates the query cache upon successful creation.
 * @name PostEventSessionTranslation
 * @param {string} eventId (path) - The ID of the event
 * @param {string} sessionId (path) - The ID of the session
 * @param {string} locale (bodyValue) - The locale for the translation
 * @param {boolean} [autoTranslate] (bodyValue) - Whether to automatically translate the session
 * @version 1.3
 **/

/**
 * @category Params
 * @group Event-Sessions-Translations
 */
export interface CreateEventSessionTranslationParams extends MutationParams {
  eventId: string;
  sessionId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Event-Sessions-Translations
 */
export const CreateEventSessionTranslation = async ({
  eventId,
  sessionId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventSessionTranslationParams): Promise<
  ConnectedXMResponse<EventSessionTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<
    ConnectedXMResponse<EventSessionTranslation>
  >(`/events/${eventId}/sessions/${sessionId}/translations`, {
    locale,
    autoTranslate,
  });
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

/**
 * @category Mutations
 * @group Event-Sessions-Translations
 */
export const useCreateEventSessionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventSessionTranslation>>,
      Omit<
        CreateEventSessionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSessionTranslationParams,
    Awaited<ReturnType<typeof CreateEventSessionTranslation>>
  >(CreateEventSessionTranslation, options, {
    domain: "events",
    type: "update",
  });
};
