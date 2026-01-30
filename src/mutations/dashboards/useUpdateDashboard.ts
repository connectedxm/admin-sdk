import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { Dashboard, ConnectedXMResponse } from "@src/interfaces";
import { DashboardUpdateInputs } from "@src/params";
import { SET_DASHBOARD_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group Dashboard
 */
export interface UpdateDashboardParams extends MutationParams {
  dashboardId: string;
  dashboard: DashboardUpdateInputs;
}

/**
 * @category Methods
 * @group Dashboard
 */
export const UpdateDashboard = async ({
  dashboardId,
  dashboard,
  adminApiParams,
  queryClient,
}: UpdateDashboardParams): Promise<ConnectedXMResponse<Dashboard>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Dashboard>>(
    `/dashboards/${dashboardId}`,
    dashboard
  );

  // Update the dashboard query data
  if (queryClient && data.status === "ok") {
    SET_DASHBOARD_QUERY_DATA(queryClient, [dashboardId], data);
  }

  return data;
};

/**
 * @category Mutations
 * @group Dashboard
 */
export const useUpdateDashboard = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateDashboard>>,
      Omit<UpdateDashboardParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateDashboardParams,
    Awaited<ReturnType<typeof UpdateDashboard>>
  >(UpdateDashboard, options);
};
