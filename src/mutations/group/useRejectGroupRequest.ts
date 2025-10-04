import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, GroupRequest } from "@src/interfaces";
import { GROUP_REQUESTS_QUERY_KEY } from "@src/queries";
import {
  MutationParams,
  ConnectedXMMutationOptions,
  useConnectedMutation,
} from "../useConnectedMutation";

/**
 * @category Params
 * @group Groups
 */
export interface RejectGroupRequestParams extends MutationParams {
  groupId: string;
  requestId: string;
}

/**
 * @category Methods
 * @group Groups
 */
export const RejectGroupRequest = async ({
  groupId,
  requestId,
  adminApiParams,
  queryClient,
}: RejectGroupRequestParams): Promise<ConnectedXMResponse<GroupRequest>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<GroupRequest>>(
    `/groups/${groupId}/requests/${requestId}/reject`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: GROUP_REQUESTS_QUERY_KEY(groupId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Groups
 */
export const useRejectGroupRequest = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RejectGroupRequest>>,
      Omit<RejectGroupRequestParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RejectGroupRequestParams,
    Awaited<ReturnType<typeof RejectGroupRequest>>
  >(RejectGroupRequest, options);
};

export default useRejectGroupRequest;
