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
 * Endpoint to remove a member from a specified group.
 * This function allows the removal of a user from a group by specifying the group ID and the account ID of the member to be removed.
 * It is designed to be used in administrative contexts where group membership management is required.
 * @name RemoveGroupMember
 * @param {string} groupId (path) The ID of the group
 * @param {string} accountId (path) The ID of the account
 * @version 1.3
 **/
export interface RemoveGroupMemberParams extends MutationParams {
  groupId: string;
  accountId: string;
}

export const RemoveGroupMember = async ({
  groupId,
  accountId,
  adminApiParams,
  queryClient,
}: RemoveGroupMemberParams): Promise<ConnectedXMResponse<GroupMembership>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<GroupMembership>>(
    `/groups/${groupId}/members/${accountId}`
  );

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
  >(RemoveGroupMember, options, {
    domain: "groups",
    type: "update",
  });
};
