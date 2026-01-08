import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, AdminNotification } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { NotificationFilters } from "@src/params";

/**
 * @category Keys
 * @group Notifications
 */
export const NOTIFICATIONS_QUERY_KEY = (filters?: NotificationFilters) => {
  const keys = ["NOTIFICATIONS"];
  if (filters) keys.push(JSON.stringify(filters));
  return keys;
};

/**
 * @category Setters
 * @group Notifications
 */
export const SET_NOTIFICATIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof NOTIFICATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetNotifications>>
) => {
  client.setQueryData(NOTIFICATIONS_QUERY_KEY(...keyParams), response);
};

interface GetNotificationsParams extends InfiniteQueryParams {
  filters?: NotificationFilters;
}

/**
 * @category Queries
 * @group Notifications
 */
export const GetNotifications = async ({
  pageParam,
  pageSize,
  orderBy,
  filters,
  search,
  adminApiParams,
}: GetNotificationsParams): Promise<
  ConnectedXMResponse<AdminNotification[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/notifications`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      read:
        typeof filters?.read !== "undefined"
          ? filters.read
            ? "true"
            : "false"
          : undefined,
      source: filters?.source || undefined,
      type: filters?.type || undefined,
      search: search || undefined,
    },
  });

  return data;
};

/**
 * @category Hooks
 * @group Notifications
 */
export const useGetNotifications = (
  filters?: NotificationFilters,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetNotifications>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetNotifications>>
  >(
    NOTIFICATIONS_QUERY_KEY(filters),
    (params: InfiniteQueryParams) => GetNotifications({ ...params, filters }),
    params,
    options
  );
};
