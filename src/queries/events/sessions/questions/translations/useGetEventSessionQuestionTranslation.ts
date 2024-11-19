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
 * @category Keys
 * @group Events
 */
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

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_QUESTION_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_QUESTION_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionTranslation>>
) => {
  client.setQueryData(
    EVENT_SESSION_QUESTION_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionTranslationProps extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionTranslation = async ({
  eventId,
  sessionId,
  questionId,
  locale,
  adminApiParams,
}: GetEventSessionTranslationProps): Promise<
  ConnectedXMResponse<EventSessionQuestionTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/translations/${locale}`
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
  questionId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventSessionTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSessionTranslation>>(
    EVENT_SESSION_QUESTION_TRANSLATION_QUERY_KEY(
      eventId,
      sessionId,
      questionId,
      locale
    ),
    (params) =>
      GetEventSessionTranslation({
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
