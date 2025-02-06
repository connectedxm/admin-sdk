import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, User } from "@src/interfaces";
import { SET_REPORT_USERS_QUERY_DATA } from "@src/queries/reports/useGetReportUsers";

/**
 * Endpoint to remove a user from a specified report.
 * This function allows the removal of a user from a report by specifying the report ID and user ID.
 * It is used in scenarios where user access to a report needs to be revoked.
 * @name RemoveReportUser
 * @param {string} reportId (path) - The id of the report
 * @param {string} userId (path) - The id of the user
 * @version 1.3
 **/
export interface RemoveReportUserParams extends MutationParams {
  reportId: string;
  userId: string;
}

export const RemoveReportUser = async ({
  reportId,
  userId,
  adminApiParams,
  queryClient,
}: RemoveReportUserParams): Promise<ConnectedXMResponse<User[]>> => {
  if (!reportId) {
    throw Error("Report ID Undefined");
  }

  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete<ConnectedXMResponse<User[]>>(
    `/reports/${reportId}/users/${userId}`
  );
  if (queryClient && data.status === "ok") {
    SET_REPORT_USERS_QUERY_DATA(queryClient, ["organization", reportId], data);
  }

  return data;
};

export const useRemoveReportUser = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveReportUser>>,
      Omit<RemoveReportUserParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveReportUserParams,
    Awaited<ReturnType<typeof RemoveReportUser>>
  >(RemoveReportUser, options, {
    domain: "reports",
    type: "update",
  });
};