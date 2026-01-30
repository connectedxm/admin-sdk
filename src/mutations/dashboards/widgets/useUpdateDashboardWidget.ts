import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { DashboardWidget, ConnectedXMResponse } from "@src/interfaces";
import { DashboardWidgetUpdateInputs } from "@src/params";
import { DASHBOARD_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Dashboard
 */
export interface UpdateDashboardWidgetParams extends MutationParams {
  dashboardId: string;
  widgetId: string;
  widgetData: DashboardWidgetUpdateInputs;
}

/**
 * @category Methods
 * @group Dashboard
 */
export const UpdateDashboardWidget = async ({
  dashboardId,
  widgetId,
  widgetData,
  adminApiParams,
  queryClient,
}: UpdateDashboardWidgetParams): Promise<
  ConnectedXMResponse<DashboardWidget>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<DashboardWidget>>(
    `/dashboards/${dashboardId}/widgets/${widgetId}`,
    widgetData
  );

  // Invalidate dashboard widgets query to refresh the data
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: DASHBOARD_QUERY_KEY(dashboardId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Dashboard
 */
export const useUpdateDashboardWidget = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateDashboardWidget>>,
      Omit<UpdateDashboardWidgetParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateDashboardWidgetParams,
    Awaited<ReturnType<typeof UpdateDashboardWidget>>
  >(UpdateDashboardWidget, options);
};
