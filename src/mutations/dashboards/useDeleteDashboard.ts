import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { DASHBOARDS_QUERY_KEY, DASHBOARD_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Dashboard
 */
export interface DeleteDashboardParams extends MutationParams {
  dashboardId: string;
}

/**
 * @category Methods
 * @group Dashboard
 */
export const DeleteDashboard = async ({
  dashboardId,
  adminApiParams,
  queryClient,
}: DeleteDashboardParams): Promise<ConnectedXMResponse<any>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<any>>(
    `/dashboards/${dashboardId}`
  );

  // Invalidate dashboards list query to refresh the data
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: DASHBOARDS_QUERY_KEY(),
    });

    // Remove the specific dashboard from cache
    queryClient.removeQueries({
      queryKey: DASHBOARD_QUERY_KEY(dashboardId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Dashboard
 */
export const useDeleteDashboard = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteDashboard>>,
      Omit<DeleteDashboardParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteDashboardParams,
    Awaited<ReturnType<typeof DeleteDashboard>>
  >(DeleteDashboard, options, {
    domain: "org",
    type: "del",
  });
};
