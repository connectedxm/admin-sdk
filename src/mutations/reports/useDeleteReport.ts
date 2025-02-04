import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { REPORTS_QUERY_KEY, REPORT_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Reports
 */
export interface DeleteReportParams extends MutationParams {
  reportId: string;
  eventId?: string;
}

/**
 * @category Methods
 * @group Reports
 */
export const DeleteReport = async ({
  reportId,
  eventId,
  adminApiParams,
  queryClient,
}: DeleteReportParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/reports/${reportId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: REPORTS_QUERY_KEY(eventId ? "event" : "organization"),
    });
    queryClient.removeQueries({
      queryKey: REPORT_QUERY_KEY(
        eventId ? "event" : "organization",
        reportId.toString()
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Reports
 */
export const useDeleteReport = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteReport>>,
      Omit<DeleteReportParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteReportParams,
    Awaited<ReturnType<typeof DeleteReport>>
  >(DeleteReport, options, {
    domain: "reports",
    type: "del",
  });
};
