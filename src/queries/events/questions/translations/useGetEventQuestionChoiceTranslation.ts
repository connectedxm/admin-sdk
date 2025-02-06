import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationQuestionChoiceTranslation } from "@src/interfaces";
import { EVENT_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY } from "./useGetEventQuestionChoiceTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Retrieves the translation for a specific event question choice based on the provided locale.
 * This function is used to fetch the translated text for a choice within an event's question, allowing for localization support.
 * It is particularly useful in applications that need to display event-related content in multiple languages.
 * @name GetEventQuestionChoiceTranslation
 * @param {string} eventId (path) The ID of the event
 * @param {string} questionId (path) The ID of the question
 * @param {string} choiceId (path) The ID of the choice
 * @param {string} locale (path) The locale for the translation
 * @version 1.3
 **/

export const EVENT_QUESTION_CHOICE_TRANSLATION_QUERY_KEY = (
  eventId: string,
  questionId: string,
  choiceId: string,
  locale: string
) => [
  ...EVENT_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY(
    eventId,
    questionId,
    choiceId
  ),
  locale,
];

export const SET_EVENT_QUESTION_CHOICE_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_QUESTION_CHOICE_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventQuestionChoiceTranslation>>
) => {
  client.setQueryData(
    EVENT_QUESTION_CHOICE_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventQuestionChoiceTranslationProps extends SingleQueryParams {
  eventId: string;
  questionId: string;
  choiceId: string;
  locale: string;
}

export const GetEventQuestionChoiceTranslation = async ({
  eventId,
  questionId,
  choiceId,
  locale,
  adminApiParams,
}: GetEventQuestionChoiceTranslationProps): Promise<
  ConnectedXMResponse<RegistrationQuestionChoiceTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/questions/${questionId}/choices/${choiceId}/translations/${locale}`
  );
  return data;
};

export const useGetEventQuestionChoiceTranslation = (
  eventId: string = "",
  questionId: string = "",
  choiceId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventQuestionChoiceTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventQuestionChoiceTranslation>
  >(
    EVENT_QUESTION_CHOICE_TRANSLATION_QUERY_KEY(
      eventId,
      questionId,
      choiceId,
      locale
    ),
    (params: SingleQueryParams) =>
      GetEventQuestionChoiceTranslation({
        eventId,
        questionId,
        choiceId,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId && !!questionId && !!choiceId && !!locale && locale !== "en",
    },
    "events"
  );
};
