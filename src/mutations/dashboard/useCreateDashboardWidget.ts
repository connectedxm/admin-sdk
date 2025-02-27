import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { DashboardWidget, ConnectedXMResponse } from "@src/interfaces";
import { DashboardWidgetCreateInput } from "@src/params";
import { DASHBOARD_QUERY_KEY } from "@src/queries/dashboards/useGetDashboards";

/**
 * @category Params
 * @group Dashboard
 */
export interface CreateDashboardWidgetParams extends MutationParams {
  dashboardId: string;
  widgetData: DashboardWidgetCreateInput;
}

/**
 * @category Methods
 * @group Dashboard
 */
export const CreateDashboardWidget = async ({
  dashboardId,
  widgetData,
  adminApiParams,
  queryClient,
}: CreateDashboardWidgetParams): Promise<
  ConnectedXMResponse<DashboardWidget>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<DashboardWidget>>(
    `/dashboards/${dashboardId}/widgets`,
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
export const useCreateDashboardWidget = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateDashboardWidget>>,
      Omit<CreateDashboardWidgetParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateDashboardWidgetParams,
    Awaited<ReturnType<typeof CreateDashboardWidget>>
  >(CreateDashboardWidget, options, {
    domain: "org",
    type: "create",
  });
};
