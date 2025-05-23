import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Dashboard } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { DASHBOARDS_QUERY_KEY } from "./useGetDashboards";

/**
 * @category Keys
 * @group Dashboards
 */
export const DASHBOARD_QUERY_KEY = (dashboardId: string) => [
  ...DASHBOARDS_QUERY_KEY(),
  "DASHBOARD",
  dashboardId,
];

/**
 * @category Setters
 * @group Dashboards
 */
export const SET_DASHBOARD_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof DASHBOARD_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetDashboard>>
) => {
  client.setQueryData(DASHBOARD_QUERY_KEY(...keyParams), response);
};

interface GetDashboardProps extends SingleQueryParams {
  dashboardId: string;
}

/**
 * @category Queries
 * @group Dashboards
 */
export const GetDashboard = async ({
  adminApiParams,
  dashboardId,
}: GetDashboardProps): Promise<ConnectedXMResponse<Dashboard>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/dashboards/${dashboardId}`);
  return data;
};

/**
 * @category Hooks
 * @group Dashboards
 */
export const useGetDashboard = (
  dashboardId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetDashboard>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetDashboard>>(
    DASHBOARD_QUERY_KEY(dashboardId),
    (params: SingleQueryParams) =>
      GetDashboard({
        ...params,
        dashboardId,
      }),
    {
      ...options,
      enabled: !!dashboardId && (options.enabled ?? true),
    },
    "org"
  );
};
