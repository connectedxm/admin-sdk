import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { CustomReport, ConnectedXMResponse } from "@src/interfaces";
import {
  CUSTOM_REPORTS_QUERY_KEY,
  SET_CUSTOM_REPORT_QUERY_DATA,
} from "@src/queries";
import { CustomReportCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Reports
 */
export interface CreateCustomReportParams extends MutationParams {
  standard: string;
  report: CustomReportCreateInputs;
}

/**
 * @category Methods
 * @group Reports
 */
export const CreateCustomReport = async ({
  standard,
  report,
  adminApiParams,
  queryClient,
}: CreateCustomReportParams): Promise<ConnectedXMResponse<CustomReport>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<CustomReport>>(
    `/reports/${standard}`,
    report
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: CUSTOM_REPORTS_QUERY_KEY() });
    SET_CUSTOM_REPORT_QUERY_DATA(queryClient, [data.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Reports
 */
export const useCreateCustomReport = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateCustomReport>>,
      Omit<CreateCustomReportParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateCustomReportParams,
    Awaited<ReturnType<typeof CreateCustomReport>>
  >(CreateCustomReport, options);
};
