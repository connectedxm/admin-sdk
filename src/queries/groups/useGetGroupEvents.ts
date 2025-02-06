import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Event } from "@src/interfaces";
import { GROUP_QUERY_KEY } from "./useGetGroup";
import { QueryClient } from "@tanstack/react-query";

/**
 * Endpoint to retrieve a list of events associated with a specific group.
 * This function allows users to fetch events for a group, with an option to filter for past events.
 * It is designed to be used in applications where event management and tracking are required.
 * @name GetGroupEvents
 * @param {string} groupId (path) The id of the group
 * @param {boolean} [past] (query) Optional flag to filter past events
 * @version 1.3
 **/

export const GROUP_EVENTS_QUERY_KEY = (groupId: string, past?: boolean) => [
  ...GROUP_QUERY_KEY(groupId),
  "EVENTS",
  past ? (past ? "past" : "upcoming") : "all",
];

export const SET_GROUP_EVENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUP_EVENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroupEvents>>
) => {
  client.setQueryData(GROUP_EVENTS_QUERY_KEY(...keyParams), response);
};

interface GetGroupEventsProps extends InfiniteQueryParams {
  groupId: string;
  past?: boolean;
}

export const GetGroupEvents = async ({
  groupId,
  pageParam,
  pageSize,
  orderBy,
  past,
  search,
  adminApiParams,
}: GetGroupEventsProps): Promise<ConnectedXMResponse<Event[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/groups/${groupId}/events`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      past: typeof past === "boolean" ? past : undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetGroupEvents = (
  groupId: string,
  past?: boolean,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetGroupEvents>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetGroupEvents>>>(
    GROUP_EVENTS_QUERY_KEY(groupId, past),
    (params: InfiniteQueryParams) =>
      GetGroupEvents({
        ...params,
        groupId,
        past,
      }),
    params,
    {
      ...options,
      enabled: !!groupId && (options.enabled ?? true),
    },
    "groups"
  );
};
