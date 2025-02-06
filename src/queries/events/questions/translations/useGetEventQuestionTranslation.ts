import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationQuestionTranslation } from "@src/interfaces";
import { EVENT_QUESTION_TRANSLATIONS_QUERY_KEY } from "./useGetEventQuestionTranslations";

/**
 * Retrieves the translation of a specific event question for a given locale.
 * This function is used to fetch the translated text of a question within an event, 
 * allowing applications to display localized content based on the user's language preference.
 * @name GetEventQuestionTranslation
 * @param {string} eventId (path) - The ID of the event
 * @param {string} questionId (path) - The ID of the question
 * @param {string} locale (path) - The locale for the translation
 * @version 1.3
 **/

/**
 * @category Keys
 * @group Events
 */
export const EVENT_QUESTION_TRANSLATION_QUERY_KEY = (
  eventId: string,
  questionId: string,
  locale: string
) => [...EVENT_QUESTION_TRANSLATIONS_QUERY_KEY(eventId, questionId), locale];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_QUESTION_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_QUESTION_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventQuestionTranslation>>
) => {
  client.setQueryData(
    EVENT_QUESTION_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventQuestionTranslationProps extends SingleQueryParams {
  eventId: string;
  questionId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventQuestionTranslation = async ({
  eventId,
  questionId,
  locale,
  adminApiParams,
}: GetEventQuestionTranslationProps): Promise<
  ConnectedXMResponse<RegistrationQuestionTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/questions/${questionId}/translations/${locale}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventQuestionTranslation = (
  eventId: string = "",
  questionId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventQuestionTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventQuestionTranslation>
  >(
    EVENT_QUESTION_TRANSLATION_QUERY_KEY(eventId, questionId, locale),
    (params: SingleQueryParams) =>
      GetEventQuestionTranslation({
        eventId,
        questionId,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId &&
        !!questionId &&
        !!locale &&
        locale !== "en" &&
        (options?.enabled ?? true),
    },
    "events"
  );
};