import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationQuestion } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";
import { QueryClient } from "@tanstack/react-query";

/**
 * Retrieves a list of questions associated with a specific event.
 * This function is designed to fetch event-related questions, which can be used in applications that require detailed information about event questions.
 * It supports infinite scrolling and pagination through the use of connected infinite queries.
 * @name GetEventQuestions
 * @param {string} eventId - The id of the event
 * @version 1.2
 **/

export const EVENT_QUESTIONS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "QUESTIONS",
];

export const SET_EVENT_QUESTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_QUESTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventQuestions>>
) => {
  client.setQueryData(EVENT_QUESTIONS_QUERY_KEY(...keyParams), response);
};

interface GetEventQuestionsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventQuestions = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventQuestionsProps): Promise<
  ConnectedXMResponse<RegistrationQuestion[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/questions`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetEventQuestions = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventQuestions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventQuestions>>
  >(
    EVENT_QUESTIONS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventQuestions({
        ...params,
        eventId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && (options.enabled ?? true),
    },
    "events"
  );
};