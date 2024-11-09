import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Report } from "@src/interfaces";
import { REPORT_QUERY_KEY } from "@src/queries";
import { ReportUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Reports
 */
export interface UpdateReportParams extends MutationParams {
  reportId: string;
  report: ReportUpdateInputs;
}

/**
 * @category Methods
 * @group Reports
 */
export const UpdateReport = async ({
  reportId,
  report,
  adminApiParams,
  queryClient,
}: UpdateReportParams): Promise<ConnectedXMResponse<Report>> => {
  if (!reportId) {
    throw Error("Report ID Undefined");
  }

  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<ConnectedXMResponse<Report>>(
    `/reports/${reportId}`,
    report
  );
  if (queryClient && data.status === "ok" && data.data?.parent?.type) {
    queryClient.invalidateQueries({
      queryKey: REPORT_QUERY_KEY(
        data?.data?.parent?.type,
        data.data.id.toString()
      ),
    });
    queryClient.setQueryData(
      REPORT_QUERY_KEY(data?.data?.parent?.type, data.data.id.toString()),
      (originalData: ConnectedXMResponse<Report>) => {
        if (
          typeof report.shared === "boolean" &&
          report.shared !== originalData.data.shared
        ) {
          originalData.data.shared = report.shared;
        }
        return originalData;
      }
    );
  }

  return data;
};

/**
 * @category Mutations
 * @group Reports
 */
export const useUpdateReport = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateReport>>,
      Omit<UpdateReportParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateReportParams,
    Awaited<ReturnType<typeof UpdateReport>>
  >(UpdateReport, options, {
    domain: "reports",
    type: "update",
  });
};
