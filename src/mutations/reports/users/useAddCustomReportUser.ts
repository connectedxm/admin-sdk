import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { CUSTOM_REPORT_USERS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Reports
 */
export interface AddCustomReportUserParams extends MutationParams {
  reportId: number;
  userId: string;
}

/**
 * @category Methods
 * @group Reports
 */
export const AddCustomReportUser = async ({
  reportId,
  userId,
  adminApiParams,
  queryClient,
}: AddCustomReportUserParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<null>>(
    `/reports/custom/${reportId}/users`,
    { userId }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CUSTOM_REPORT_USERS_QUERY_KEY(reportId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Reports
 */
export const useAddCustomReportUser = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddCustomReportUser>>,
      Omit<AddCustomReportUserParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddCustomReportUserParams,
    Awaited<ReturnType<typeof AddCustomReportUser>>
  >(AddCustomReportUser, options);
};
