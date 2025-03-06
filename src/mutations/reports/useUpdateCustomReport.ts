import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { CustomReport, ConnectedXMResponse } from "@src/interfaces";
import {
  SET_CUSTOM_REPORT_QUERY_DATA,
  CUSTOM_REPORTS_QUERY_KEY,
} from "@src/queries";
import { CustomReportUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Reports
 */
export interface UpdateCustomReportParams extends MutationParams {
  reportId: number;
  report: CustomReportUpdateInputs;
}

/**
 * @category Methods
 * @group Reports
 */
export const UpdateCustomReport = async ({
  reportId,
  report,
  adminApiParams,
  queryClient,
}: UpdateCustomReportParams): Promise<ConnectedXMResponse<CustomReport>> => {
  if (!reportId) {
    throw Error("Report ID Undefined");
  }

  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<ConnectedXMResponse<CustomReport>>(
    `/reports/custom/${reportId}`,
    {
      ...report,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      _count: undefined,
    }
  );
  if (queryClient && data.status === "ok") {
    SET_CUSTOM_REPORT_QUERY_DATA(queryClient, [reportId], data);
    queryClient.invalidateQueries({ queryKey: CUSTOM_REPORTS_QUERY_KEY() });
  }
  return data;
};

/**
 * @category Mutations
 * @group Reports
 */
export const useUpdateCustomReport = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateCustomReport>>,
      Omit<UpdateCustomReportParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateCustomReportParams,
    Awaited<ReturnType<typeof UpdateCustomReport>>
  >(UpdateCustomReport, options, {
    domain: "reports",
    type: "update",
  });
};
