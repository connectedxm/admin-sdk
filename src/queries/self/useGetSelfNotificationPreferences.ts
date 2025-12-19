import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse, OrganizationMembership } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { SELF_QUERY_KEY } from "./useGetSelf";

/**
 * @category Keys
 * @group Self
 */
export const SELF_NOTIFICATION_PREFERENCES_QUERY_KEY = () => [
  ...SELF_QUERY_KEY(),
  "notification-preferences",
];

/**
 * @category Setters
 * @group Self
 */
export const SET_SELF_NOTIFICATION_PREFERENCES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_NOTIFICATION_PREFERENCES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfNotificationPreferences>>
) => {
  client.setQueryData(
    SELF_NOTIFICATION_PREFERENCES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetSelfNotificationPreferencesProps extends SingleQueryParams {}

/**
 * @category Queries
 * @group Self
 */
export const GetSelfNotificationPreferences = async ({
  adminApiParams,
}: GetSelfNotificationPreferencesProps): Promise<
  ConnectedXMResponse<OrganizationMembership>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/self/notification-preferences`);
  return data;
};

/**
 * @category Hooks
 * @group Self
 */
export const useGetSelfNotificationPreferences = (
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfNotificationPreferences>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfNotificationPreferences>
  >(
    SELF_NOTIFICATION_PREFERENCES_QUERY_KEY(),
    (params: SingleQueryParams) =>
      GetSelfNotificationPreferences({
        ...params,
      }),
    options
  );
};
