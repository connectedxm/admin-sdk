import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, GroupRequest } from "@src/interfaces";
import { GROUP_REQUESTS_QUERY_KEY } from "@src/queries";
import {
  MutationParams,
  ConnectedXMMutationOptions,
  useConnectedMutation,
} from "../useConnectedMutation";

/**
 * Endpoint to accept a group request.
 * This function allows the acceptance of a pending group request by specifying the group and request IDs.
 * It is used in scenarios where a user or admin needs to approve a request to join a group.
 * @name AcceptGroupRequest
 * @param {string} groupId - The id of the group
 * @param {string} requestId - The id of the request
 * @version 1.2
 **/

export interface AcceptGroupRequestParams extends MutationParams {
  groupId: string;
  requestId: string;
}

export const AcceptGroupRequest = async ({
  groupId,
  requestId,
  adminApiParams,
  queryClient,
}: AcceptGroupRequestParams): Promise<ConnectedXMResponse<GroupRequest>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<GroupRequest>>(
    `/groups/${groupId}/requests/${requestId}/accept`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: GROUP_REQUESTS_QUERY_KEY(groupId),
    });
  }
  return data;
};

export const useAcceptGroupRequest = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AcceptGroupRequest>>,
      Omit<AcceptGroupRequestParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AcceptGroupRequestParams,
    Awaited<ReturnType<typeof AcceptGroupRequest>>
  >(AcceptGroupRequest, options, {
    domain: "groups",
    type: "update",
  });
};

export default useAcceptGroupRequest;