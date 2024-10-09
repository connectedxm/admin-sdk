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
export const ANNOUNCEMENTS_QUERY_KEY = (eventId?: string, groupId?: string) => {
  const keys = ["ANNOUNCEMENTS"];
  if (eventId) keys.push(eventId);
  if (groupId) keys.push(groupId);
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
  eventId?: string;
  groupId?: string;
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
  eventId,
  groupId,
  adminApiParams,
}: GetAnnouncementsProps): Promise<ConnectedXMResponse<Announcement[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/announcements`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      eventId: eventId || undefined,
      groupId: groupId || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Announcements
 */
export const useGetAnnouncements = (
  eventId?: string,
  groupId?: string,
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
    ANNOUNCEMENTS_QUERY_KEY(eventId, groupId),
    (params: InfiniteQueryParams) =>
      GetAnnouncements({ eventId, groupId, ...params }),
    params,
    options,
    "announcements"
  );
};
