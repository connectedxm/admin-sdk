import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Match } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_ROUNDS_QUERY_KEY } from "./useGetEventRounds";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_MATCHES_QUERY_KEY = (eventId: string) => [
  ...EVENT_ROUNDS_QUERY_KEY(eventId),
  "ALL_MATCHES",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_MATCHES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_MATCHES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventMatches>>
) => {
  client.setQueryData(EVENT_MATCHES_QUERY_KEY(...keyParams), response);
};

interface GetEventMatchesProps extends InfiniteQueryParams {
  eventId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventMatches = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventMatchesProps): Promise<ConnectedXMResponse<Match[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/matches`, {
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
export const useGetEventMatches = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventMatches>>
  > = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetEventMatches>>>(
    EVENT_MATCHES_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventMatches({
        eventId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    },
    "events"
  );
};
