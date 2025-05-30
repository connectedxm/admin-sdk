import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Thread } from "@src/interfaces";
import { EVENT_QUERY_KEY } from "./useGetEvent";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_THREADS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "THREADS",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_THREADS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_THREADS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventThreads>>
) => {
  client.setQueryData(EVENT_THREADS_QUERY_KEY(...keyParams), response);
};

interface GetEventThreadsProps extends InfiniteQueryParams {
  eventId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventThreads = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventThreadsProps): Promise<ConnectedXMResponse<Thread[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/threads`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventThreads = (
  eventId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventThreads>>
  > = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetEventThreads>>>(
    EVENT_THREADS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventThreads({
        ...params,
        eventId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && (options.enabled ?? true),
    },
    ["events", "threads"]
  );
};
