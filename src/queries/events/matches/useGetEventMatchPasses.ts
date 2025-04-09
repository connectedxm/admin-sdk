import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPass } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_MATCH_QUERY_KEY } from "./useGetEventMatch";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_MATCH_PASSES_QUERY_KEY = (
  eventId: string,
  roundId: string,
  matchId: string
) => [...EVENT_MATCH_QUERY_KEY(eventId, roundId, matchId), "PASSES"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_MATCH_PASSES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_MATCH_PASSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventMatchPasses>>
) => {
  client.setQueryData(EVENT_MATCH_PASSES_QUERY_KEY(...keyParams), response);
};

interface GetEventMatchPassesProps extends InfiniteQueryParams {
  eventId: string;
  roundId: string;
  matchId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventMatchPasses = async ({
  eventId,
  roundId,
  matchId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventMatchPassesProps): Promise<ConnectedXMResponse<EventPass[]>> => {
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
export const useGetEventMatchPasses = (
  eventId: string = "",
  roundId: string = "",
  matchId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventMatchPasses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventMatchPasses>>
  >(
    EVENT_MATCH_PASSES_QUERY_KEY(eventId, roundId, matchId),
    (params: InfiniteQueryParams) =>
      GetEventMatchPasses({
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
