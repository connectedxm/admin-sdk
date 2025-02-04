import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { REPORTS_QUERY_KEY, REPORT_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete a specific report by its ID.
 * This function allows for the removal of a report from the system, optionally associated with a specific event.
 * It is designed to be used in applications where report management is required, ensuring that the report is deleted and relevant queries are invalidated.
 * @name DeleteReport
 * @param {string} reportId - The ID of the report to be deleted
 * @param {string} [eventId] - Optional event ID associated with the report
 * @version 1.2
 **/

export interface DeleteReportParams extends MutationParams {
  reportId: string;
  eventId?: string;
}

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