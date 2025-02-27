import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { DASHBOARD_WIDGETS_QUERY_KEY } from "@src/queries/dashboards/useGetDashboardWidgets";

/**
 * @category Params
 * @group Dashboard
 */
export interface DeleteDashboardWidgetParams extends MutationParams {
  dashboardId: string;
  widgetId: string;
}

/**
 * @category Methods
 * @group Dashboard
 */
export const DeleteDashboardWidget = async ({
  dashboardId,
  widgetId,
  adminApiParams,
  queryClient,
}: DeleteDashboardWidgetParams): Promise<ConnectedXMResponse<any>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<any>>(
    `/dashboards/${dashboardId}/widgets/${widgetId}`
  );

  // Invalidate dashboard widgets query to refresh the data
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: DASHBOARD_WIDGETS_QUERY_KEY(dashboardId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Dashboard
 */
export const useDeleteDashboardWidget = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteDashboardWidget>>,
      Omit<DeleteDashboardWidgetParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteDashboardWidgetParams,
    Awaited<ReturnType<typeof DeleteDashboardWidget>>
  >(DeleteDashboardWidget, options, {
    domain: "org",
    type: "del",
  });
};
