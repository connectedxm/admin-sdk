import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, GroupMembership } from "@src/interfaces";
import {
  ACCOUNT_GROUPS_QUERY_KEY,
  GROUP_MEMBERS_QUERY_KEY,
  GROUP_MODERATORS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Groups
 */
export interface RemoveGroupMemberParams extends MutationParams {
  groupId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Groups
 */
export const RemoveGroupMember = async ({
  groupId,
  accountId,
  adminApiParams,
  queryClient,
}: RemoveGroupMemberParams): Promise<ConnectedXMResponse<GroupMembership>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<
    ConnectedXMResponse<GroupMembership>
  >(`/groups/${groupId}/members/${accountId}`);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: GROUP_MODERATORS_QUERY_KEY(groupId),
    });
    queryClient.invalidateQueries({
      queryKey: GROUP_MEMBERS_QUERY_KEY(groupId),
    });
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_GROUPS_QUERY_KEY(accountId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Groups
 */
export const useRemoveGroupMember = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveGroupMember>>,
      Omit<RemoveGroupMemberParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveGroupMemberParams,
    Awaited<ReturnType<typeof RemoveGroupMember>>
  >(RemoveGroupMember, options);
};
