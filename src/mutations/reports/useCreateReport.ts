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
 * @category Params
 * @group Reports
 */
export interface CreateReportParams extends MutationParams {
  report: ReportCreateInputs;
  type: ReportType;
}

/**
 * @category Methods
 * @group Reports
 */
export const CreateReport = async ({
  report,
  type,
  adminApiParams,
  queryClient,
}: CreateReportParams): Promise<ConnectedXMResponse<Report>> => {
  if (!report.parentId) throw new Error("Parent ID null");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Report>>(
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

/**
 * @category Mutations
 * @group Reports
 */
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
