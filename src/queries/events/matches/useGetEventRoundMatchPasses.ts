import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPass } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_ROUND_MATCH_QUERY_KEY } from "./useGetEventRoundMatch";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ROUND_MATCH_PASSES_QUERY_KEY = (
  eventId: string,
  roundId: string,
  matchId: string
) => [...EVENT_ROUND_MATCH_QUERY_KEY(eventId, roundId, matchId), "PASSES"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ROUND_MATCH_PASSES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ROUND_MATCH_PASSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRoundMatchPasses>>
) => {
  client.setQueryData(
    EVENT_ROUND_MATCH_PASSES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventRoundMatchPassesProps extends InfiniteQueryParams {
  eventId: string;
  roundId: string;
  matchId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventRoundMatchPasses = async ({
  eventId,
  roundId,
  matchId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventRoundMatchPassesProps): Promise<
  ConnectedXMResponse<EventPass[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/rounds/${roundId}/matches/${matchId}/passes`,
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
export const useGetEventRoundMatchPasses = (
  eventId: string = "",
  roundId: string = "",
  matchId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventRoundMatchPasses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventRoundMatchPasses>>
  >(
    EVENT_ROUND_MATCH_PASSES_QUERY_KEY(eventId, roundId, matchId),
    (params: InfiniteQueryParams) =>
      GetEventRoundMatchPasses({
        eventId,
        roundId,
        matchId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled:
        !!eventId && !!roundId && !!matchId && (options?.enabled ?? true),
    },
    "events"
  );
};
