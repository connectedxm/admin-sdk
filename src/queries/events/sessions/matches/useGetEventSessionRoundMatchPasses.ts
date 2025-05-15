import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPass } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_SESSION_ROUND_MATCH_QUERY_KEY } from "./useGetEventSessionRoundMatch";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_ROUND_MATCH_PASSES_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  roundId: string,
  matchId: string
) => [
  ...EVENT_SESSION_ROUND_MATCH_QUERY_KEY(eventId, sessionId, roundId, matchId),
  "PASSES",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_ROUND_MATCH_PASSES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSION_ROUND_MATCH_PASSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionRoundMatchPasses>>
) => {
  client.setQueryData(
    EVENT_SESSION_ROUND_MATCH_PASSES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionRoundMatchPassesProps extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
  roundId: string;
  matchId: string;
}

/**
 * @category Queries
 * @group Event
 */
export const GetEventSessionRoundMatchPasses = async ({
  eventId,
  sessionId,
  roundId,
  matchId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionRoundMatchPassesProps): Promise<
  ConnectedXMResponse<EventPass[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/rounds/${roundId}/matches/${matchId}/passes`,
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
export const useGetEventSessionRoundMatchPasses = (
  eventId: string = "",
  sessionId: string = "",
  roundId: string = "",
  matchId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionRoundMatchPasses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionRoundMatchPasses>>
  >(
    EVENT_SESSION_ROUND_MATCH_PASSES_QUERY_KEY(
      eventId,
      sessionId,
      roundId,
      matchId
    ),
    (params: InfiniteQueryParams) =>
      GetEventSessionRoundMatchPasses({
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
