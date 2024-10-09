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
export interface AcceptGroupRequestParams extends MutationParams {
  groupId: string;
  requestId: string;
}

/**
 * @category Methods
 * @group Groups
 */
export const AcceptGroupRequest = async ({
  groupId,
  requestId,
  adminApiParams,
  queryClient,
}: AcceptGroupRequestParams): Promise<ConnectedXMResponse<GroupRequest>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<GroupRequest>>(
    `/groups/${groupId}/requests/${requestId}/accept`
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
