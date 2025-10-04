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
export const EVENT_ROUND_MATCHES_QUERY_KEY = (
  eventId: string,
  roundId: string
) => [...EVENT_ROUNDS_QUERY_KEY(eventId), roundId, "MATCHES"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ROUND_MATCHES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ROUND_MATCHES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRoundMatches>>
) => {
  client.setQueryData(EVENT_ROUND_MATCHES_QUERY_KEY(...keyParams), response);
};

interface GetEventRoundMatchesProps extends InfiniteQueryParams {
  eventId: string;
  roundId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventRoundMatches = async ({
  eventId,
  roundId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventRoundMatchesProps): Promise<ConnectedXMResponse<Match[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/rounds/${roundId}/matches`,
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
export const useGetEventRoundMatches = (
  eventId: string = "",
  roundId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventRoundMatches>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventRoundMatches>>
  >(
    EVENT_ROUND_MATCHES_QUERY_KEY(eventId, roundId),
    (params: InfiniteQueryParams) =>
      GetEventRoundMatches({
        eventId,
        roundId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!roundId && (options?.enabled ?? true),
    }
  );
};
