import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSessionQuestionTranslation } from "@src/interfaces";
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

/**
 * @category Queries
 * @group Events
 */
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

/**
 * @category Hooks
 * @group Events
 */
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
    (params: SingleQueryParams) =>
      GetEventSessionQuestionTranslation({
        eventId,
        sessionId,
        questionId,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId &&
        !!sessionId &&
        !!questionId &&
        !!locale &&
        locale !== "en" &&
        (options?.enabled ?? true),
    }
  );
};
