import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { CUSTOM_REPORT_USERS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Reports
 */
export interface RemoveCustomReportUserParams extends MutationParams {
  reportId: number;
  userId: string;
}

/**
 * @category Methods
 * @group Reports
 */
export const RemoveCustomReportUser = async ({
  reportId,
  userId,
  adminApiParams,
  queryClient,
}: RemoveCustomReportUserParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/reports/custom/${reportId}/users/${userId}`
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
export const useRemoveCustomReportUser = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveCustomReportUser>>,
      Omit<RemoveCustomReportUserParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveCustomReportUserParams,
    Awaited<ReturnType<typeof RemoveCustomReportUser>>
  >(RemoveCustomReportUser, options, {
    domain: "reports",
    type: "del",
  });
};
