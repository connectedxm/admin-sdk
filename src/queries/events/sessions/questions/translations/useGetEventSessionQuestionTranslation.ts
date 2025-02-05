import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../../useConnectedSingleQuery";
import {
  ConnectedXMResponse,
  EventSessionQuestionTranslation,
} from "@src/interfaces";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_SESSION_QUESTION_TRANSLATIONS_QUERY_KEY } from "./useGetEventSessionQuestionTranslations";

/**
 * Retrieves the translation of a specific question within an event session for a given locale.
 * This function is used to fetch the translated text of a question in an event session, allowing for localization of event content.
 * It is particularly useful in applications that support multiple languages and need to display event content in the user's preferred language.
 * @name GetEventSessionQuestionTranslation
 * @param {string} eventId - The ID of the event
 * @param {string} sessionId - The ID of the session
 * @param {string} questionId - The ID of the question
 * @param {string} locale - The locale for the translation
 * @version 1.2
 **/

export const EVENT_SESSION_QUESTION_TRANSLATION_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  questionId: string,
  locale: string
) => [
  ...EVENT_SESSION_QUESTION_TRANSLATIONS_QUERY_KEY(
    eventId,
    sessionId,
    questionId
  ),
  locale,
];

export const SET_EVENT_SESSION_QUESTION_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_QUESTION_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionQuestionTranslation>>
) => {
  client.setQueryData(
    EVENT_SESSION_QUESTION_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionQuestionTranslationProps extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  locale: string;
}

export const GetEventSessionQuestionTranslation = async ({
  eventId,
  sessionId,
  questionId,
  locale,
  adminApiParams,
}: GetEventSessionQuestionTranslationProps): Promise<
  ConnectedXMResponse<EventSessionQuestionTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/translations/${locale}`
  );
  return data;
};

export const useGetEventSessionQuestionTranslation = (
  eventId: string = "",
  sessionId: string = "",
  questionId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventSessionQuestionTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventSessionQuestionTranslation>
  >(
    EVENT_SESSION_QUESTION_TRANSLATION_QUERY_KEY(
      eventId,
      sessionId,
      questionId,
      locale
    ),
    (params) =>
      GetEventSessionQuestionTranslation({
        ...params,
        eventId,
        sessionId,
        questionId,
        locale,
      }),
    {
      ...options,
      enabled:
        !!eventId && !!sessionId && !!questionId && !!locale && locale !== "en",
    },
    "events"
  );
};