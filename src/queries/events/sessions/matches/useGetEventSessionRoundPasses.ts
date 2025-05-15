import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPass } from "@src/interfaces";
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
export const EVENT_SESSION_ROUND_PASSES_QUERY_KEY = (
  assigned: boolean,
  eventId: string,
  sessionId: string,
  roundId: string
) => [
  ...EVENT_SESSION_ROUNDS_QUERY_KEY(eventId, sessionId),
  roundId,
  "PASSES",
  assigned ? "ASSIGNED" : "UNASSIGNED",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_ROUND_PASSES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSION_ROUND_PASSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionRoundPasses>>
) => {
  client.setQueryData(
    EVENT_SESSION_ROUND_PASSES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionRoundPassesProps extends InfiniteQueryParams {
  assigned: boolean;
  eventId: string;
  sessionId: string;
  roundId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionRoundPasses = async ({
  assigned,
  eventId,
  sessionId,
  roundId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionRoundPassesProps): Promise<
  ConnectedXMResponse<EventPass[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/rounds/${roundId}/passes`,
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
export const useGetEventSessionRoundPasses = (
  assigned: boolean,
  eventId: string = "",
  sessionId: string = "",
  roundId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionRoundPasses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionRoundPasses>>
  >(
    EVENT_SESSION_ROUND_PASSES_QUERY_KEY(assigned, eventId, sessionId, roundId),
    (params: InfiniteQueryParams) =>
      GetEventSessionRoundPasses({
        eventId,
        sessionId,
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
        !!sessionId &&
        !!roundId &&
        (options?.enabled ?? true),
    },
    "events"
  );
};
