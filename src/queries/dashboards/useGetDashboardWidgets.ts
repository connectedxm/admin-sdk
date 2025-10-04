import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { DashboardWidget } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { DASHBOARD_QUERY_KEY } from "./useGetDashboard";
/**
 * @category Keys
 * @group Dashboards
 */
export const DASHBOARD_WIDGETS_QUERY_KEY = (
  dashboardId: string,
  type?: string
) => {
  const key = [...DASHBOARD_QUERY_KEY(dashboardId), "WIDGETS"];
  if (type) key.push(type);
  return key;
};

/**
 * @category Setters
 * @group Dashboards
 */
export const SET_DASHBOARD_WIDGETS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof DASHBOARD_WIDGETS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetDashboardWidgets>>
) => {
  client.setQueryData(DASHBOARD_WIDGETS_QUERY_KEY(...keyParams), response);
};

interface GetDashboardWidgetsProps extends SingleQueryParams {
  dashboardId: string;
  type?: string;
}

/**
 * @category Queries
 * @group Dashboards
 */
export const GetDashboardWidgets = async ({
  adminApiParams,
  dashboardId,
  type,
}: GetDashboardWidgetsProps): Promise<
  ConnectedXMResponse<DashboardWidget[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/dashboard/${dashboardId}/widgets`, {
    params: {
      type,
    },
  });

  return data;
};

/**
 * @category Hooks
 * @group Dashboards
 */
export const useGetDashboardWidgets = (
  dashboardId: string,
  type?: string,
  options: SingleQueryOptions<ReturnType<typeof GetDashboardWidgets>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetDashboardWidgets>>(
    DASHBOARD_WIDGETS_QUERY_KEY(dashboardId, type),
    (params: SingleQueryParams) =>
      GetDashboardWidgets({
        ...params,
        dashboardId,
        type,
      }),
    {
      ...options,
      enabled: !!dashboardId && (options.enabled ?? true),
    }
  );
};
