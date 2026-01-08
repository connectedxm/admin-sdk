import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse, NotificationStats } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Notifications
 */
export const NOTIFICATION_STATS_QUERY_KEY = () => ["NOTIFICATIONS", "STATS"];

/**
 * @category Setters
 * @group Notifications
 */
export const SET_NOTIFICATION_STATS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof NOTIFICATION_STATS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetNotificationStats>>
) => {
  client.setQueryData(NOTIFICATION_STATS_QUERY_KEY(...keyParams), response);
};

interface GetNotificationStatsProps extends SingleQueryParams {}

/**
 * @category Queries
 * @group Notifications
 */
export const GetNotificationStats = async ({
  adminApiParams,
}: GetNotificationStatsProps): Promise<
  ConnectedXMResponse<NotificationStats>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/notifications/stats`);
  return data;
};

/**
 * @category Hooks
 * @group Notifications
 */
export const useGetNotificationStats = (
  options: SingleQueryOptions<ReturnType<typeof GetNotificationStats>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetNotificationStats>>(
    NOTIFICATION_STATS_QUERY_KEY(),
    (params: SingleQueryParams) => GetNotificationStats({ ...params }),
    options
  );
};
