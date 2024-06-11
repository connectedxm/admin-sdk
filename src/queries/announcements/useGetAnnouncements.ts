import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Announcement } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Announcements
 */
export const ANNOUNCEMENTS_QUERY_KEY = (filters?: string) => {
  const keys = ["ANNOUNCEMENTS"];
  if (filters) keys.push(filters);
  return keys;
};

/**
 * @category Setters
 * @group Announcements
 */
export const SET_ANNOUNCEMENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ANNOUNCEMENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAnnouncements>>
) => {
  client.setQueryData(ANNOUNCEMENTS_QUERY_KEY(...keyParams), response);
};

interface GetAnnouncementsProps extends InfiniteQueryParams {
  filters?: string;
}

/**
 * @category Queries
 * @group Announcements
 */
export const GetAnnouncements = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  filters,
  adminApiParams,
}: GetAnnouncementsProps): Promise<ConnectedXMResponse<Announcement[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/announcements`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      filters: filters || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Announcements
 */
export const useGetAnnouncements = (
  filters?: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAnnouncements>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAnnouncements>>
  >(
    ANNOUNCEMENTS_QUERY_KEY(filters),
    (params: InfiniteQueryParams) => GetAnnouncements({ filters, ...params }),
    params,
    options
  );
};
