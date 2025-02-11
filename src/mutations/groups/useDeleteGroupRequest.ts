import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { GROUP_REQUESTS_QUERY_KEY } from "@src/queries";
import {
  MutationParams,
  ConnectedXMMutationOptions,
  useConnectedMutation,
} from "../useConnectedMutation";

/**
 * Endpoint to delete a specific group request and invalidate related queries.
 * This function allows the removal of a group request by its unique identifiers,
 * ensuring that any cached queries related to the group requests are invalidated
 * to maintain data consistency.
 * @name DeleteGroupRequest
 * @param {string} groupId (path) The id of the group
 * @param {string} requestId (path) The id of the request
 * @version 1.3
 **/

export interface DeleteGroupRequestParams extends MutationParams {
  groupId: string;
  requestId: string;
}

export const DeleteGroupRequest = async ({
  groupId,
  requestId,
  adminApiParams,
  queryClient,
}: DeleteGroupRequestParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/groups/${groupId}/requests/${requestId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: GROUP_REQUESTS_QUERY_KEY(groupId),
    });
  }
  return data;
};

export const useDeleteGroupRequest = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteGroupRequest>>,
      Omit<DeleteGroupRequestParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteGroupRequestParams,
    Awaited<ReturnType<typeof DeleteGroupRequest>>
  >(DeleteGroupRequest, options, {
    domain: "groups",
    type: "update",
  });
};

export default useDeleteGroupRequest;
