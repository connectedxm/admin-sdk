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
 * @category Keys
 * @group Events
 */
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

/**
 * @category Setters
 * @group Events
 */
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

/**
 * @category Queries
 * @group Events
 */
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
/**
 * @category Hooks
 * @group Events
 */
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
    }
  );
};
