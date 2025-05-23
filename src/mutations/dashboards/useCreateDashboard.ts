import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { Dashboard, ConnectedXMResponse } from "@src/interfaces";
import { DashboardCreateInputs } from "@src/params";
import { DASHBOARDS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Dashboard
 */
export interface CreateDashboardParams extends MutationParams {
  dashboard: DashboardCreateInputs;
}

/**
 * @category Methods
 * @group Dashboard
 */
export const CreateDashboard = async ({
  dashboard,
  adminApiParams,
  queryClient,
}: CreateDashboardParams): Promise<ConnectedXMResponse<Dashboard>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Dashboard>>(
    `/dashboards`,
    dashboard
  );

  // Invalidate dashboards list query to refresh the data
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: DASHBOARDS_QUERY_KEY(),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Dashboard
 */
export const useCreateDashboard = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateDashboard>>,
      Omit<CreateDashboardParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateDashboardParams,
    Awaited<ReturnType<typeof CreateDashboard>>
  >(CreateDashboard, options, {
    domain: "org",
    type: "create",
  });
};
