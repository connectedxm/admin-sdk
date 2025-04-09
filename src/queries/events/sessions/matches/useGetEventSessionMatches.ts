import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Match } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_SESSION_ROUNDS_QUERY_KEY } from "./useGetEventSessionRounds";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_MATCHES_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  roundId: string
) => [
  ...EVENT_SESSION_ROUNDS_QUERY_KEY(eventId, sessionId),
  roundId,
  "MATCHES",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_MATCHES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSION_MATCHES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionMatches>>
) => {
  client.setQueryData(EVENT_SESSION_MATCHES_QUERY_KEY(...keyParams), response);
};

interface GetEventSessionMatchesProps extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
  roundId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionMatches = async ({
  eventId,
  sessionId,
  roundId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionMatchesProps): Promise<ConnectedXMResponse<Match[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/rounds/${roundId}/matches`,
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
export const useGetEventSessionMatches = (
  eventId: string = "",
  sessionId: string = "",
  roundId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionMatches>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionMatches>>
  >(
    EVENT_SESSION_MATCHES_QUERY_KEY(eventId, sessionId, roundId),
    (params: InfiniteQueryParams) =>
      GetEventSessionMatches({
        eventId,
        sessionId,
        roundId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled:
        !!eventId && !!sessionId && !!roundId && (options?.enabled ?? true),
    },
    "events"
  );
};
