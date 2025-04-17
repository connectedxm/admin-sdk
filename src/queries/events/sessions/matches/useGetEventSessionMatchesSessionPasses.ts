import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventAccess } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_SESSION_MATCH_QUERY_KEY } from "./useGetEventSessionMatch";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_MATCH_ACCESSES_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  roundId: string,
  matchId: string
) => [
  ...EVENT_SESSION_MATCH_QUERY_KEY(eventId, sessionId, roundId, matchId),
  "ACCESSES",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_MATCH_ACCESSES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSION_MATCH_ACCESSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionMatchAccesses>>
) => {
  client.setQueryData(
    EVENT_SESSION_MATCH_ACCESSES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionMatchAccessesProps extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
  roundId: string;
  matchId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionMatchAccesses = async ({
  eventId,
  sessionId,
  roundId,
  matchId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionMatchAccessesProps): Promise<
  ConnectedXMResponse<EventAccess[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/rounds/${roundId}/matches/${matchId}/accesses`,
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
export const useGetEventSessionMatchAccesses = (
  eventId: string = "",
  sessionId: string = "",
  roundId: string = "",
  matchId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionMatchAccesses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionMatchAccesses>>
  >(
    EVENT_SESSION_MATCH_ACCESSES_QUERY_KEY(
      eventId,
      sessionId,
      roundId,
      matchId
    ),
    (params: InfiniteQueryParams) =>
      GetEventSessionMatchAccesses({
        eventId,
        sessionId,
        roundId,
        matchId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled:
        !!eventId &&
        !!sessionId &&
        !!roundId &&
        !!matchId &&
        (options?.enabled ?? true),
    },
    "events"
  );
};
