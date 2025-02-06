import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationQuestionResponse } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUESTION_QUERY_KEY } from "./useGetEventQuestion";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Fetches responses for a specific event question with optional filtering.
 * This function allows retrieval of responses associated with a particular event question, 
 * providing options for pagination and sorting. It is useful for applications that need to 
 * display or process responses to event questions.
 * @name GetEventQuestionResponses
 * @param {string} eventId (path) - The id of the event
 * @param {string} questionId (path) - The id of the question
 * @version 1.3
 **/

export const EVENT_QUESTION_RESPONSES_QUERY_KEY = (
  eventId: string,
  questionId: string
) => [...EVENT_QUESTION_QUERY_KEY(eventId, questionId), "RESPONSES"];

export const SET_EVENT_QUESTION_RESPONSES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_QUESTION_RESPONSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventQuestionResponses>>
) => {
  client.setQueryData(
    EVENT_QUESTION_RESPONSES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventQuestionResponsesProps extends InfiniteQueryParams {
  eventId: string;
  questionId: string;
}

export const GetEventQuestionResponses = async ({
  eventId,
  questionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventQuestionResponsesProps): Promise<
  ConnectedXMResponse<RegistrationQuestionResponse[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/questions/${questionId}/responses`,
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

export const useGetEventQuestionResponses = (
  eventId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventQuestionResponses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventQuestionResponses>>
  >(
    EVENT_QUESTION_RESPONSES_QUERY_KEY(eventId, questionId),
    (params: InfiniteQueryParams) =>
      GetEventQuestionResponses({
        ...params,
        eventId,
        questionId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!questionId && (options.enabled ?? true),
    },
    "events"
  );
};