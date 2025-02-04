import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationQuestionChoiceSubQuestion } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUESTION_CHOICE_QUERY_KEY } from "./useGetEventQuestionChoice";

/**
 * Fetches sub-questions associated with a specific event question choice.
 * This endpoint is used to retrieve detailed sub-question data for a given choice within an event's question.
 * It is particularly useful in scenarios where understanding the hierarchical structure of event questions is necessary.
 * @name GetEventQuestionChoiceSubQuestions
 * @param {string} eventId - The id of the event
 * @param {string} questionId - The id of the question
 * @param {string} choiceId - The id of the choice
 * @version 1.2
 **/

export const EVENT_QUESTION_CHOICE_QUESTIONS_QUERY_KEY = (
  eventId: string,
  questionId: string,
  choiceId: string
) => [
  ...EVENT_QUESTION_CHOICE_QUERY_KEY(eventId, questionId, choiceId),
  "QUESTIONS",
];

export const SET_EVENT_QUESTION_CHOICE_QUESTIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_QUESTION_CHOICE_QUESTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventQuestionChoiceSubQuestions>>
) => {
  client.setQueryData(
    EVENT_QUESTION_CHOICE_QUESTIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventQuestionChoiceSubQuestionsProps extends InfiniteQueryParams {
  eventId: string;
  questionId: string;
  choiceId: string;
}

export const GetEventQuestionChoiceSubQuestions = async ({
  eventId,
  questionId,
  choiceId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventQuestionChoiceSubQuestionsProps): Promise<
  ConnectedXMResponse<RegistrationQuestionChoiceSubQuestion[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/questions/${questionId}/choices/${choiceId}/subQuestions`,
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

export const useGetEventQuestionChoiceSubQuestions = (
  eventId: string = "",
  questionId: string = "",
  choiceId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventQuestionChoiceSubQuestions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventQuestionChoiceSubQuestions>>
  >(
    EVENT_QUESTION_CHOICE_QUESTIONS_QUERY_KEY(eventId, questionId, choiceId),
    (params: any) =>
      GetEventQuestionChoiceSubQuestions({
        eventId,
        questionId,
        choiceId,
        ...params,
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