import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Report, ReportType } from "@src/interfaces";
import { REPORTS_QUERY_KEY } from "@src/queries";
import { ReportCreateInputs } from "@src/params";

/**
 * Endpoint to create a new report within the system.
 * This function allows users to submit data for a new report, specifying the type of report they wish to create.
 * It ensures that a parent ID is provided and interacts with the admin API to store the report data.
 * Upon successful creation, it invalidates the relevant queries to update the report data cache.
 * @name CreateReport
 * @param {ReportCreateInputs} report (body) The report data to be created
 * @param {ReportType} type (query) The type of the report
 * @version 1.3
 **/
export interface CreateReportParams extends MutationParams {
  report: ReportCreateInputs;
  type: ReportType;
}

export const CreateReport = async ({
  report,
  type,
  adminApiParams,
  queryClient,
}: CreateReportParams): Promise<ConnectedXMResponse<Report>> => {
  if (!report.parentId) throw new Error("Parent ID null");
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Report>>(
    `/reports`,
    {
      ...report,
      parentId: report.parentId,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: REPORTS_QUERY_KEY(type) });
  }
  return data;
};

export const useCreateReport = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateReport>>,
      Omit<CreateReportParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateReportParams,
    Awaited<ReturnType<typeof CreateReport>>
  >(CreateReport, options, {
    domain: "reports",
    type: "create",
  });
};
