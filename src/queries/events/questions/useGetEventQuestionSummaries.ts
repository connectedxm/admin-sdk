import { ConnectedXMResponse } from "@src/interfaces";
import { EVENT_QUERY_KEY } from "../useGetEvent";
import { QueryClient } from "@tanstack/react-query";
import { SummaryData } from "./useGetEventQuestionSummary";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_QUESTION_SUMMARIES_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "QUESTION_SUMMARIES",
];

/**
 * @category Setters
 * @group Events
 */
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

/**
 * @category Queries
 * @group Events
 */
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
/**
 * @category Hooks
 * @group Events
 */
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
    }
  );
};
