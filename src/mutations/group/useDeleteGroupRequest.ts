import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
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
export interface DeleteGroupRequestParams extends MutationParams {
  groupId: string;
  requestId: string;
}

/**
 * @category Methods
 * @group Groups
 */
export const DeleteGroupRequest = async ({
  groupId,
  requestId,
  adminApiParams,
  queryClient,
}: DeleteGroupRequestParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/groups/${groupId}/requests/${requestId}`
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
