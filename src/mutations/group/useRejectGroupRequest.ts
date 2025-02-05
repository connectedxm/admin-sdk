import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, GroupRequest } from "@src/interfaces";
import { GROUP_REQUESTS_QUERY_KEY } from "@src/queries";
import {
  MutationParams,
  ConnectedXMMutationOptions,
  useConnectedMutation,
} from "../useConnectedMutation";

/**
 * Endpoint to reject a group request.
 * This function allows an administrator to reject a specific request to join a group.
 * It is designed to be used in applications where group membership management is required.
 * @name RejectGroupRequest
 * @param {string} groupId - The id of the group
 * @param {string} requestId - The id of the request
 * @version 1.2
 **/

export interface RejectGroupRequestParams extends MutationParams {
  groupId: string;
  requestId: string;
}

export const RejectGroupRequest = async ({
  groupId,
  requestId,
  adminApiParams,
  queryClient,
}: RejectGroupRequestParams): Promise<ConnectedXMResponse<GroupRequest>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<GroupRequest>>(
    `/groups/${groupId}/requests/${requestId}/reject`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: GROUP_REQUESTS_QUERY_KEY(groupId),
    });
  }
  return data;
};

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
  >(RejectGroupRequest, options, {
    domain: "groups",
    type: "update",
  });
};

export default useRejectGroupRequest;