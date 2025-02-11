import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSpeakerTranslation } from "@src/interfaces";
import { EVENT_SPEAKER_TRANSLATIONS_QUERY_KEY } from "./useGetEventSpeakerTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Retrieves the translation details for a specific event speaker in a given locale.
 * This function is used to fetch the translated information of a speaker for a particular event,
 * allowing applications to display speaker details in different languages.
 * @name GetEventSpeakerTranslation
 * @param {string} eventId (path) The ID of the event
 * @param {string} speakerId (path) The ID of the speaker
 * @param {string} locale (path) The locale for the translation
 * @version 1.3
 **/

export const EVENT_SPEAKER_TRANSLATION_QUERY_KEY = (
  eventId: string,
  speakerId: string,
  locale: string
) => [...EVENT_SPEAKER_TRANSLATIONS_QUERY_KEY(eventId, speakerId), locale];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SPEAKER_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SPEAKER_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSpeakerTranslation>>
) => {
  client.setQueryData(
    EVENT_SPEAKER_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSpeakerTranslationProps extends SingleQueryParams {
  eventId: string;
  speakerId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSpeakerTranslation = async ({
  eventId,
  speakerId,
  locale,
  adminApiParams,
}: GetEventSpeakerTranslationProps): Promise<
  ConnectedXMResponse<EventSpeakerTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/speakers/${speakerId}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSpeakerTranslation = (
  eventId: string = "",
  speakerId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventSpeakerTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSpeakerTranslation>>(
    EVENT_SPEAKER_TRANSLATION_QUERY_KEY(eventId, speakerId, locale),
    (params) =>
      GetEventSpeakerTranslation({
        ...params,
        eventId,
        speakerId,
        locale,
      }),
    {
      ...options,
      enabled:
        !!eventId &&
        !!speakerId &&
        !!locale &&
        locale !== "en" &&
        (options.enabled ?? true),
    },
    "events"
  );
};
