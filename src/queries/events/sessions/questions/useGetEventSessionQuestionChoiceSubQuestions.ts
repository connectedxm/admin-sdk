import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { EventSessionQuestionChoiceSubQuestion } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_SESSION_QUESTION_CHOICE_QUERY_KEY } from "./useGetEventSessionQuestionChoice";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_QUESTION_CHOICE_QUESTIONS_QUERY_KEY = (
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
  "QUESTIONS",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_QUESTION_CHOICE_QUESTIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<
    typeof EVENT_SESSION_QUESTION_CHOICE_QUESTIONS_QUERY_KEY
  >,
  response: Awaited<
    ReturnType<typeof GetEventSessionQuestionChoiceSubQuestions>
  >
) => {
  client.setQueryData(
    EVENT_SESSION_QUESTION_CHOICE_QUESTIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionQuestionChoiceSubQuestionsProps
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
export const GetEventSessionQuestionChoiceSubQuestions = async ({
  eventId,
  sessionId,
  questionId,
  choiceId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionQuestionChoiceSubQuestionsProps): Promise<
  ConnectedXMResponse<EventSessionQuestionChoiceSubQuestion[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/choices/${choiceId}/subQuestions`,
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
export const useGetEventSessionQuestionChoiceSubQuestions = (
  eventId: string = "",
  sessionId: string = "",
  questionId: string = "",
  choiceId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionQuestionChoiceSubQuestions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionQuestionChoiceSubQuestions>>
  >(
    EVENT_SESSION_QUESTION_CHOICE_QUESTIONS_QUERY_KEY(
      eventId,
      sessionId,
      questionId,
      choiceId
    ),
    (params: any) =>
      GetEventSessionQuestionChoiceSubQuestions({
        eventId,
        sessionId,
        questionId,
        choiceId,
        ...params,
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
    },
    "events"
  );
};
