import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import {
  ConnectedXMResponse,
  AdminNotificationPreferences,
} from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Preferences
 */
export const PREFERENCES_QUERY_KEY = () => ["PREFERENCES"];

/**
 * @category Setters
 * @group Preferences
 */
export const SET_PREFERENCES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof PREFERENCES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetPreferences>>
) => {
  client.setQueryData(PREFERENCES_QUERY_KEY(...keyParams), response);
};

interface GetPreferencesProps extends SingleQueryParams {}

/**
 * @category Queries
 * @group Preferences
 */
export const GetPreferences = async ({
  adminApiParams,
}: GetPreferencesProps): Promise<
  ConnectedXMResponse<AdminNotificationPreferences>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/preferences`);
  return data;
};

/**
 * @category Hooks
 * @group Preferences
 */
export const useGetPreferences = (
  options: SingleQueryOptions<ReturnType<typeof GetPreferences>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetPreferences>>(
    PREFERENCES_QUERY_KEY(),
    (params: SingleQueryParams) =>
      GetPreferences({
        ...params,
      }),
    options
  );
};
