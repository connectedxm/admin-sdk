import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSessionTranslation } from "@src/interfaces";
import { EVENT_SESSION_TRANSLATIONS_QUERY_KEY } from "./useGetEventSessionTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Retrieves the translation for a specific event session based on the provided event ID, session ID, and locale.
 * This function is part of the event management system and is used to fetch localized translations for event sessions.
 * It is designed to be used in applications that require displaying event session details in different languages.
 * @name GetEventSessionTranslation
 * @param {string} eventId (path) - The ID of the event
 * @param {string} sessionId (path) - The ID of the session
 * @param {string} locale (path) - The locale for the translation
 * @version 1.3
 */
export const EVENT_SESSION_TRANSLATION_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  locale: string
) => [...EVENT_SESSION_TRANSLATIONS_QUERY_KEY(eventId, sessionId), locale];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionTranslation>>
) => {
  client.setQueryData(
    EVENT_SESSION_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionTranslationProps extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionTranslation = async ({
  eventId,
  sessionId,
  locale,
  adminApiParams,
}: GetEventSessionTranslationProps): Promise<
  ConnectedXMResponse<EventSessionTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/translations/${locale}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSessionTranslation = (
  eventId: string = "",
  sessionId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventSessionTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSessionTranslation>>(
    EVENT_SESSION_TRANSLATION_QUERY_KEY(eventId, sessionId, locale),
    (params) =>
      GetEventSessionTranslation({
        ...params,
        eventId,
        sessionId,
        locale,
      }),
    {
      ...options,
      enabled: !!eventId && !!locale && locale !== "en",
    },
    "events"
  );
};