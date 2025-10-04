import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSessionQuestionChoiceTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../../useConnectedInfiniteQuery";
import { EVENT_SESSION_QUESTION_CHOICE_QUERY_KEY } from "../useGetEventSessionQuestionChoice";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  questionId: string,
  choiceId: string
) => [
  ...EVENT_SESSION_QUESTION_CHOICE_QUERY_KEY(
    eventId,
    sessionId,
    questionId,
    choiceId
  ),
  "TRANSLATIONS",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_QUESTION_CHOICE_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<
    typeof EVENT_SESSION_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY
  >,
  response: Awaited<
    ReturnType<typeof GetEventSessionQuestionChoiceTranslations>
  >
) => {
  client.setQueryData(
    EVENT_SESSION_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionQuestionChoiceTranslationsProps
  extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  choiceId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionQuestionChoiceTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  sessionId,
  questionId,
  choiceId,
  adminApiParams,
}: GetEventSessionQuestionChoiceTranslationsProps): Promise<
  ConnectedXMResponse<EventSessionQuestionChoiceTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/choices/${choiceId}/translations`,
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

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSessionQuestionChoiceTranslations = (
  eventId: string = "",
  sessionId: string = "",
  questionId: string = "",
  choiceId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionQuestionChoiceTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionQuestionChoiceTranslations>>
  >(
    EVENT_SESSION_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY(
      eventId,
      sessionId,
      questionId,
      choiceId
    ),
    (params: InfiniteQueryParams) =>
      GetEventSessionQuestionChoiceTranslations({
        ...params,
        eventId,
        sessionId,
        questionId,
        choiceId,
      }),
    params,
    {
      ...options,
      enabled:
        !!eventId &&
        !!sessionId &&
        !!questionId &&
        !!choiceId &&
        (options.enabled ?? true),
    }
  );
};
