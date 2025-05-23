import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse, NotificationPreferences } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";

/**
 * @category Keys
 * @group Accounts
 */
export const ACCOUNT_NOTIFICATION_PREFERENCES_QUERY_KEY = (
  accountId: string
) => [...ACCOUNT_QUERY_KEY(accountId), "notification-preferences"];

/**
 * @category Setters
 * @group Accounts
 */
export const SET_ACCOUNT_NOTIFICATION_PREFERENCES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_NOTIFICATION_PREFERENCES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountNotificationPreferences>>
) => {
  client.setQueryData(
    ACCOUNT_NOTIFICATION_PREFERENCES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetAccountNotificationPreferencesProps extends SingleQueryParams {
  accountId: string;
}

/**
 * @category Queries
 * @group Accounts
 */
export const GetAccountNotificationPreferences = async ({
  accountId = "",
  adminApiParams,
}: GetAccountNotificationPreferencesProps): Promise<
  ConnectedXMResponse<NotificationPreferences>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/accounts/${accountId}/notification-preferences`
  );
  return data;
};

/**
 * @category Hooks
 * @group Accounts
 */
export const useGetAccountNotificationPreferences = (
  accountId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetAccountNotificationPreferences>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetAccountNotificationPreferences>
  >(
    ACCOUNT_NOTIFICATION_PREFERENCES_QUERY_KEY(accountId),
    (params: SingleQueryParams) =>
      GetAccountNotificationPreferences({
        accountId: accountId || "unknown",
        ...params,
      }),
    {
      ...options,
      enabled: !!accountId && (options?.enabled ?? true),
    },
    "accounts"
  );
};
