import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSessionPass } from "@src/interfaces";
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
export const EVENT_SESSION_MATCH_SESSION_PASSES_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  roundId: string,
  matchId: string
) => [
  ...EVENT_SESSION_MATCH_QUERY_KEY(eventId, sessionId, roundId, matchId),
  "SESSION_PASSES",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_MATCH_SESSION_PASSES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSION_MATCH_SESSION_PASSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionMatchSessionPasses>>
) => {
  client.setQueryData(
    EVENT_SESSION_MATCH_SESSION_PASSES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionMatchSessionPassesProps extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
  roundId: string;
  matchId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionMatchSessionPasses = async ({
  eventId,
  sessionId,
  roundId,
  matchId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionMatchSessionPassesProps): Promise<
  ConnectedXMResponse<EventSessionPass[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/rounds/${roundId}/matches/${matchId}/sessionPasses`,
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
export const useGetEventSessionMatchSessionPasses = (
  eventId: string = "",
  sessionId: string = "",
  roundId: string = "",
  matchId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionMatchSessionPasses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionMatchSessionPasses>>
  >(
    EVENT_SESSION_MATCH_SESSION_PASSES_QUERY_KEY(
      eventId,
      sessionId,
      roundId,
      matchId
    ),
    (params: InfiniteQueryParams) =>
      GetEventSessionMatchSessionPasses({
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
