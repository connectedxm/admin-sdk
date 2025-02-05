import { ConnectedXMResponse, SummaryData } from "@src/interfaces";
import { EVENT_QUERY_KEY } from "../useGetEvent";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";

/**
 * Retrieves a list of summaries for questions associated with a specific event.
 * This function is designed to fetch detailed summaries of questions for a given event,
 * which can be used in applications that require insights into event-related questions.
 * @name GetEventQuestionSummaries
 * @param {string} eventId - The id of the event
 * @version 1.2
 **/

export const EVENT_QUESTION_SUMMARIES_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "QUESTION_SUMMARIES",
];

export const SET_EVENT_QUESTION_SUMMARIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_QUESTION_SUMMARIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventQuestionSummaries>>
) => {
  client.setQueryData(
    EVENT_QUESTION_SUMMARIES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventQuestionSummariesProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventQuestionSummaries = async ({
  eventId,
  pageParam,
  pageSize,
  adminApiParams,
}: GetEventQuestionSummariesProps): Promise<
  ConnectedXMResponse<SummaryData[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/questions/summary`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
    },
  });
  return data;
};

export const useGetEventQuestionSummaries = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventQuestionSummaries>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventQuestionSummaries>>
  >(
    EVENT_QUESTION_SUMMARIES_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventQuestionSummaries({ ...params, eventId }),
    params,
    {
      ...options,
      enabled: !!eventId && (options.enabled ?? true),
    },
    "events"
  );
};
