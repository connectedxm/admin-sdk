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
 * @category Keys
 * @group Groups
 */
export const GROUP_EVENTS_QUERY_KEY = (groupId: string, past?: boolean) => [
  ...GROUP_QUERY_KEY(groupId),
  "EVENTS",
  past ? (past ? "past" : "upcoming") : "all",
];

/**
 * @category Setters
 * @group Groups
 */
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

/**
 * @category Queries
 * @group Groups
 */
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
/**
 * @category Hooks
 * @group Groups
 */
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
    }
  );
};
