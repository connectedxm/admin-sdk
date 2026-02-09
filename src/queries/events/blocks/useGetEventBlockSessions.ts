import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSession } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_BLOCK_QUERY_KEY } from "./useGetEventBlock";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_BLOCK_SESSIONS_QUERY_KEY = (
  eventId: string,
  blockId: string
) => [...EVENT_BLOCK_QUERY_KEY(eventId, blockId), "SESSIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_BLOCK_SESSIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_BLOCK_SESSIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventBlockSessions>>
) => {
  client.setQueryData(EVENT_BLOCK_SESSIONS_QUERY_KEY(...keyParams), response);
};

interface GetEventBlockSessionsProps extends InfiniteQueryParams {
  eventId: string;
  blockId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventBlockSessions = async ({
  eventId,
  blockId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventBlockSessionsProps): Promise<
  ConnectedXMResponse<EventSession[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/blocks/${blockId}/sessions`,
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
export const useGetEventBlockSessions = (
  eventId: string = "",
  blockId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventBlockSessions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventBlockSessions>>
  >(
    EVENT_BLOCK_SESSIONS_QUERY_KEY(eventId, blockId),
    (params: InfiniteQueryParams) =>
      GetEventBlockSessions({
        ...params,
        eventId,
        blockId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!blockId && (options.enabled ?? true),
    }
  );
};
