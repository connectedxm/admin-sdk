import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, User } from "@src/interfaces";
import { SET_REPORT_USERS_QUERY_DATA } from "@src/queries/reports/useGetReportUsers";

/**
 * Endpoint to add a user to a specific report within the system.
 * This function allows the addition of a user to a report by specifying the report ID and user ID.
 * It is designed to be used in applications where managing report participants is required.
 * @name AddReportUser
 * @param {string} reportId (path) The id of the report
 * @param {string} userId (bodyValue) The id of the user
 * @version 1.3
 **/

export interface AddReportUserParams extends MutationParams {
  reportId: string;
  userId: string;
}

export const AddReportUser = async ({
  reportId,
  userId,
  adminApiParams,
  queryClient,
}: AddReportUserParams): Promise<ConnectedXMResponse<User[]>> => {
  if (!reportId) {
    throw Error("Report ID Undefined");
  }

  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<ConnectedXMResponse<User[]>>(
    `/reports/${reportId}/users`,
    { userId }
  );
  if (queryClient && data.status === "ok") {
    SET_REPORT_USERS_QUERY_DATA(queryClient, ["organization", reportId], data);
  }

  return data;
};

export const useAddReportUser = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddReportUser>>,
      Omit<AddReportUserParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddReportUserParams,
    Awaited<ReturnType<typeof AddReportUser>>
  >(AddReportUser, options, {
    domain: "reports",
    type: "update",
  });
};
