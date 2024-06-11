import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { RegistrationChoiceSubQuestion } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUESTION_CHOICE_QUERY_KEY } from "./useGetEventQuestionChoice";

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
  ConnectedXMResponse<RegistrationChoiceSubQuestion[]>
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

const useGetEventQuestionChoiceSubQuestions = (
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
    }
  );
};

export default useGetEventQuestionChoiceSubQuestions;
