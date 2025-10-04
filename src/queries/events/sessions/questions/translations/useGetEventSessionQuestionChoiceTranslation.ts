import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSessionQuestionChoiceTranslation } from "@src/interfaces";
import { EVENT_SESSION_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY } from "./useGetEventSessionQuestionChoiceTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_QUESTION_CHOICE_TRANSLATION_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  questionId: string,
  choiceId: string,
  locale: string
) => [
  ...EVENT_SESSION_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY(
    eventId,
    sessionId,
    questionId,
    choiceId
  ),
  locale,
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_QUESTION_CHOICE_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<
    typeof EVENT_SESSION_QUESTION_CHOICE_TRANSLATION_QUERY_KEY
  >,
  response: Awaited<ReturnType<typeof GetEventSessionQuestionChoiceTranslation>>
) => {
  client.setQueryData(
    EVENT_SESSION_QUESTION_CHOICE_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionQuestionChoiceTranslationProps
  extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  choiceId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionQuestionChoiceTranslation = async ({
  eventId,
  sessionId,
  questionId,
  choiceId,
  locale,
  adminApiParams,
}: GetEventSessionQuestionChoiceTranslationProps): Promise<
  ConnectedXMResponse<EventSessionQuestionChoiceTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/choices/${choiceId}/translations/${locale}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSessionQuestionChoiceTranslation = (
  eventId: string = "",
  sessionId: string = "",
  questionId: string = "",
  choiceId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventSessionQuestionChoiceTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventSessionQuestionChoiceTranslation>
  >(
    EVENT_SESSION_QUESTION_CHOICE_TRANSLATION_QUERY_KEY(
      eventId,
      sessionId,
      questionId,
      choiceId,
      locale
    ),
    (params: SingleQueryParams) =>
      GetEventSessionQuestionChoiceTranslation({
        eventId,
        sessionId,
        questionId,
        choiceId,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId &&
        !!sessionId &&
        !!questionId &&
        !!choiceId &&
        !!locale &&
        locale !== "en",
    }
  );
};
