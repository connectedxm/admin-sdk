import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { NotificationFilters } from "@src/params";

/**
 * @category Keys
 * @group Notifications
 */
export const NOTIFICATION_COUNT_QUERY_KEY = (filters?: NotificationFilters) => {
  const keys = ["NOTIFICATIONS", "COUNT"];
  if (filters) keys.push(JSON.stringify(filters));
  return keys;
};

/**
 * @category Setters
 * @group Notifications
 */
export const SET_NOTIFICATION_COUNT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof NOTIFICATION_COUNT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetNotificationCount>>
) => {
  client.setQueryData(NOTIFICATION_COUNT_QUERY_KEY(...keyParams), response);
};

interface GetNotificationCountProps extends SingleQueryParams {
  filters?: NotificationFilters;
}

/**
 * @category Queries
 * @group Notifications
 */
export const GetNotificationCount = async ({
  filters,
  adminApiParams,
}: GetNotificationCountProps): Promise<
  ConnectedXMResponse<{ notifications: number }>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/notifications/count`, {
    params: {
      read:
        typeof filters?.read !== "undefined"
          ? filters.read
            ? "true"
            : "false"
          : undefined,
      source: filters?.source || undefined,
      type: filters?.type || undefined,
    },
  });
  return data;
};

/**
 * @category Hooks
 * @group Notifications
 */
export const useGetNotificationCount = (
  filters?: NotificationFilters,
  options: SingleQueryOptions<ReturnType<typeof GetNotificationCount>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetNotificationCount>>(
    NOTIFICATION_COUNT_QUERY_KEY(filters),
    (params: SingleQueryParams) =>
      GetNotificationCount({
        ...params,
        filters,
      }),
    options
  );
};
