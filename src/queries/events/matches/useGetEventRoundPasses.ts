import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPass } from "@src/interfaces";
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
export const EVENT_ROUND_PASSES_QUERY_KEY = (
  assigned: boolean,
  eventId: string,
  roundId: string
) => [
  ...EVENT_ROUNDS_QUERY_KEY(eventId),
  roundId,
  "PASSES",
  assigned ? "ASSIGNED" : "UNASSIGNED",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ROUND_PASSES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ROUND_PASSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRoundPasses>>
) => {
  client.setQueryData(EVENT_ROUND_PASSES_QUERY_KEY(...keyParams), response);
};

interface GetEventRoundPassesProps extends InfiniteQueryParams {
  assigned: boolean;
  eventId: string;
  roundId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventRoundPasses = async ({
  assigned,
  eventId,
  roundId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventRoundPassesProps): Promise<ConnectedXMResponse<EventPass[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/rounds/${roundId}/passes`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
        assigned,
      },
    }
  );

  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventRoundPasses = (
  assigned: boolean,
  eventId: string = "",
  roundId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventRoundPasses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventRoundPasses>>
  >(
    EVENT_ROUND_PASSES_QUERY_KEY(assigned, eventId, roundId),
    (params: InfiniteQueryParams) =>
      GetEventRoundPasses({
        eventId,
        roundId,
        assigned,
        ...params,
      }),
    params,
    {
      ...options,
      enabled:
        typeof assigned === "boolean" &&
        !!eventId &&
        !!roundId &&
        (options?.enabled ?? true),
    },
    "events"
  );
};
