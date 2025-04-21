import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSession } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_PASS_QUERY_KEY } from "./useGetEventPass";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PASS_SESSIONS_QUERY_KEY = (
  eventId: string,
  passId: string
) => [...EVENT_PASS_QUERY_KEY(eventId, passId), "SESSIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PASS_SESSIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PASS_SESSIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassSessions>>
) => {
  client.setQueryData(EVENT_PASS_SESSIONS_QUERY_KEY(...keyParams), response);
};

interface GetEventPassSessionsProps extends InfiniteQueryParams {
  eventId: string;
  passId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPassSessions = async ({
  eventId,
  passId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventPassSessionsProps): Promise<ConnectedXMResponse<EventSession[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/passes/${passId}/sessions`,
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
export const useGetEventPassSessions = (
  eventId: string = "",
  passId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPassSessions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPassSessions>>
  >(
    EVENT_PASS_SESSIONS_QUERY_KEY(eventId, passId),
    (params: InfiniteQueryParams) =>
      GetEventPassSessions({
        ...params,
        eventId,
        passId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!passId && (options.enabled ?? true),
    },
    "events"
  );
};
