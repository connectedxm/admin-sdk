import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { CustomReportExportInputs } from "@src/params";

/**
 * @category Params
 * @group Reports
 */
export interface ExportCustomReportParams extends MutationParams {
  reportId: number;
  body: CustomReportExportInputs;
}

/**
 * @category Methods
 * @group Reports
 */
export const ExportCustomReport = async ({
  reportId,
  body,
  adminApiParams,
}: ExportCustomReportParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<null>>(
    `/reports/custom/${reportId}/export`,
    body
  );
  return data;
};

/**
 * @category Mutations
 * @group Reports
 */
export const useExportCustomReport = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ExportCustomReport>>,
      Omit<ExportCustomReportParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ExportCustomReportParams,
    Awaited<ReturnType<typeof ExportCustomReport>>
  >(ExportCustomReport, options);
};
