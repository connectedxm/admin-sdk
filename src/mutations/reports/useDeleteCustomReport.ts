import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  CUSTOM_REPORTS_QUERY_KEY,
  CUSTOM_REPORT_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Reports
 */
export interface DeleteCustomReportParams extends MutationParams {
  reportId: number;
}

/**
 * @category Methods
 * @group Reports
 */
export const DeleteCustomReport = async ({
  reportId,
  adminApiParams,
  queryClient,
}: DeleteCustomReportParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/reports/custom/${reportId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: CUSTOM_REPORTS_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: CUSTOM_REPORT_QUERY_KEY(reportId) });
  }
  return data;
};

/**
 * @category Mutations
 * @group Reports
 */
export const useDeleteCustomReport = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteCustomReport>>,
      Omit<DeleteCustomReportParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteCustomReportParams,
    Awaited<ReturnType<typeof DeleteCustomReport>>
  >(DeleteCustomReport, options, {
    domain: "reports",
    type: "del",
  });
};
