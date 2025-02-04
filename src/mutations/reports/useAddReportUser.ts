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
export interface AddReportUserParams extends MutationParams {
  reportId: string;
  userId: string;
}

/**
 * @category Methods
 * @group Reports
 */
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

/**
 * @category Mutations
 * @group Reports
 */
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
