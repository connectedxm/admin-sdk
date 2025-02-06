import type { Account, ConnectedXMResponse } from "@interfaces";
import { EVENT_QUERY_KEY } from "../useGetEvent";
import { QueryClient } from "@tanstack/react-query";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Retrieves a list of co-hosts for a specified event.
 * This function fetches data about co-hosts associated with a particular event, allowing users to view and manage event co-hosts.
 * It is designed for applications that require detailed information about event co-hosts.
 * @name GetEventCoHosts
 * @param {string} eventId (path) - The id of the event
 * @version 1.3
 **/

export const EVENT_CO_HOSTS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "COHOSTS",
];

export const SET_EVENT_CO_HOSTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_CO_HOSTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventCoHosts>>
) => {
  client.setQueryData(EVENT_CO_HOSTS_QUERY_KEY(...keyParams), response);
};

interface GetEventCoHostsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventCoHosts = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventCoHostsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/coHosts`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetEventCoHosts = (
  eventId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventCoHosts>>
  > = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetEventCoHosts>>>(
    EVENT_CO_HOSTS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) => GetEventCoHosts({ eventId, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && (options.enabled ?? true),
    },
    "events"
  );
};