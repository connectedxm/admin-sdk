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
