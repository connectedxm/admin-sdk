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
 * Endpoint to manage and fetch announcements.
 * This function provides the ability to retrieve announcements based on various optional filters such as event, group, tier, channel, and account.
 * It is designed to be used in applications where announcements need to be dynamically fetched and managed.
 * @name GetAnnouncements
 * @param {string} [eventId] (query) The id of the event
 * @param {string} [groupId] (query) The id of the group
 * @param {string} [tierId] (query) The id of the tier
 * @param {string} [channelId] (query) The id of the channel
 * @param {string} [accountId] (query) The id of the account
 * @version 1.3
 **/

interface AnnouncementFilters {
  eventId?: string;
  groupId?: string;
  tierId?: string;
  channelId?: string;
  accountId?: string;
}

/**
 * @category Keys
 * @group Announcements
 */
export const ANNOUNCEMENTS_QUERY_KEY = (filters?: AnnouncementFilters) => {
  const keys = ["ANNOUNCEMENTS"];
  if (filters?.eventId) keys.push(filters.eventId);
  if (filters?.groupId) keys.push(filters.groupId);
  if (filters?.tierId) keys.push(filters.tierId);
  if (filters?.accountId) keys.push(filters.accountId);
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
  filters?: AnnouncementFilters;
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
      ...filters,
    },
  });
  return data;
};

/**
 * @category Hooks
 * @group Announcements
 */
export const useGetAnnouncements = (
  filters?: AnnouncementFilters,
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
    options,
    "announcements"
  );
};
