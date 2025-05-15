import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Match } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSIONS_MATCHES_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "ALL_SESSION_MATCHES",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSIONS_MATCHES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSIONS_MATCHES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionsMatches>>
) => {
  client.setQueryData(EVENT_SESSIONS_MATCHES_QUERY_KEY(...keyParams), response);
};

interface GetEventSessionsMatchesProps extends InfiniteQueryParams {
  eventId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionsMatches = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionsMatchesProps): Promise<ConnectedXMResponse<Match[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/session-matches`, {
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
export const useGetEventSessionsMatches = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionsMatches>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionsMatches>>
  >(
    EVENT_SESSIONS_MATCHES_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventSessionsMatches({
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
