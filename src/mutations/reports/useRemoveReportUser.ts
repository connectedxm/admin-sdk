import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, User } from "@src/interfaces";
import { SET_REPORT_USERS_QUERY_DATA } from "@src/queries/reports/useGetReportUsers";

/**
 * @category Params
 * @group Reports
 */
export interface RemoveReportUserParams extends MutationParams {
  reportId: string;
  userId: string;
}

/**
 * @category Methods
 * @group Reports
 */
export const RemoveReportUser = async ({
  reportId,
  userId,
  adminApiParams,
  queryClient,
}: RemoveReportUserParams): Promise<ConnectedXMResponse<User[]>> => {
  if (!reportId) {
    throw Error("Report ID Undefined");
  }

  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete<ConnectedXMResponse<User[]>>(
    `/reports/${reportId}/users/${userId}`
  );
  if (queryClient && data.status === "ok") {
    SET_REPORT_USERS_QUERY_DATA(queryClient, ["organization", reportId], data);
  }

  return data;
};

/**
 * @category Mutations
 * @group Reports
 */
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
