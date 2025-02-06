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
 * Endpoint to update a report and invalidate related queries.
 * This function allows updating the details of a specific report identified by its ID.
 * It ensures that any related queries are invalidated to maintain data consistency.
 * @name UpdateReport
 * @param {string} reportId (path) The ID of the report
 * @param {ReportUpdateInputs} report (body) The report update inputs
 * @version 1.3
 **/

export interface UpdateReportParams extends MutationParams {
  reportId: string;
  report: ReportUpdateInputs;
}

export const UpdateReport = async ({
  reportId,
  report,
  adminApiParams,
  queryClient,
}: UpdateReportParams): Promise<ConnectedXMResponse<Report>> => {
  if (!reportId) {
    throw Error("Report ID Undefined");
  }

  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put<ConnectedXMResponse<Report>>(
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
