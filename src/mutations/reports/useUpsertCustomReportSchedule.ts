import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse, CustomReportSchedule } from "@src/interfaces";
import { SET_CUSTOM_REPORT_SCHEDULE_QUERY_DATA } from "@src/queries";
import { CustomReportScheduleInputs } from "@src/params";

/**
 * @category Params
 * @group Reports
 */
export interface UpsertCustomReportScheduleParams extends MutationParams {
  reportId: number;
  schedule: CustomReportScheduleInputs;
}

/**
 * @category Methods
 * @group Reports
 */
export const UpsertCustomReportSchedule = async ({
  reportId,
  schedule,
  adminApiParams,
  queryClient,
}: UpsertCustomReportScheduleParams): Promise<
  ConnectedXMResponse<CustomReportSchedule>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<CustomReportSchedule>
  >(`/reports/custom/${reportId}/schedule`, schedule);
  if (queryClient && data.status === "ok") {
    SET_CUSTOM_REPORT_SCHEDULE_QUERY_DATA(queryClient, [reportId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Reports
 */
export const useUpsertCustomReportSchedule = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpsertCustomReportSchedule>>,
      Omit<UpsertCustomReportScheduleParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpsertCustomReportScheduleParams,
    Awaited<ReturnType<typeof UpsertCustomReportSchedule>>
  >(UpsertCustomReportSchedule, options);
};
