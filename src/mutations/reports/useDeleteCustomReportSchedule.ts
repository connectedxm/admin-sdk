import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse, CustomReportSchedule } from "@src/interfaces";
import { CUSTOM_REPORT_SCHEDULE_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Reports
 */
export interface DeleteCustomReportScheduleParams extends MutationParams {
  reportId: number;
}

/**
 * @category Methods
 * @group Reports
 */
export const DeleteCustomReportSchedule = async ({
  reportId,
  adminApiParams,
  queryClient,
}: DeleteCustomReportScheduleParams): Promise<
  ConnectedXMResponse<CustomReportSchedule | null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<
    ConnectedXMResponse<CustomReportSchedule | null>
  >(`/reports/custom/${reportId}/schedule`);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CUSTOM_REPORT_SCHEDULE_QUERY_KEY(reportId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Reports
 */
export const useDeleteCustomReportSchedule = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteCustomReportSchedule>>,
      Omit<DeleteCustomReportScheduleParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteCustomReportScheduleParams,
    Awaited<ReturnType<typeof DeleteCustomReportSchedule>>
  >(DeleteCustomReportSchedule, options);
};
