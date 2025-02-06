import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationQuestionChoiceTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_QUESTION_CHOICE_QUERY_KEY } from "../useGetEventQuestionChoice";

/**
 * Retrieves translations for a specific event question choice.
 * This function is used to fetch translation data for a given choice within an event question,
 * allowing applications to display localized text for event-related questions.
 * @name GetEventQuestionChoiceTranslations
 * @param {string} eventId (path) The ID of the event
 * @param {string} questionId (path) The ID of the question
 * @param {string} choiceId (path) The ID of the choice
 * @version 1.3
 **/

export const EVENT_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  questionId: string,
  choiceId: string
) => [
  ...EVENT_QUESTION_CHOICE_QUERY_KEY(eventId, questionId, choiceId),
  "TRANSLATIONS",
];

export const SET_EVENT_QUESTION_CHOICE_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventQuestionChoiceTranslations>>
) => {
  client.setQueryData(
    EVENT_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventQuestionChoiceTranslationsProps extends InfiniteQueryParams {
  eventId: string;
  questionId: string;
  choiceId: string;
}

export const GetEventQuestionChoiceTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  questionId,
  choiceId,
  adminApiParams,
}: GetEventQuestionChoiceTranslationsProps): Promise<
  ConnectedXMResponse<RegistrationQuestionChoiceTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/questions/${questionId}/choices/${choiceId}/translations`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};

export const useGetEventQuestionChoiceTranslations = (
  eventId: string = "",
  questionId: string = "",
  choiceId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventQuestionChoiceTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventQuestionChoiceTranslations>>
  >(
    EVENT_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY(eventId, questionId, choiceId),
    (params: InfiniteQueryParams) =>
      GetEventQuestionChoiceTranslations({
        ...params,
        eventId,
        questionId,
        choiceId,
      }),
    params,
    {
      ...options,
      enabled:
        !!eventId && !!questionId && !!choiceId && (options.enabled ?? true),
    },
    "events"
  );
};
