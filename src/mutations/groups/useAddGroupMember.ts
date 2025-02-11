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
} from "@src/queries";

/**
 * Endpoint to add a member to a specific group within an organization.
 * This function allows the addition of an account to a group by specifying the group and account IDs.
 * It is designed to be used in applications where managing group memberships is required.
 * @name AddGroupMember
 * @param {string} groupId (path) The id of the group
 * @param {string} accountId (path) The id of the account
 * @version 1.3
 **/

export interface AddGroupMemberParams extends MutationParams {
  groupId: string;
  accountId: string;
}

export const AddGroupMember = async ({
  groupId,
  accountId,
  adminApiParams,
  queryClient,
}: AddGroupMemberParams): Promise<ConnectedXMResponse<GroupMembership>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<GroupMembership>>(
    `/groups/${groupId}/members/${accountId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: GROUP_MEMBERS_QUERY_KEY(groupId),
    });
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_GROUPS_QUERY_KEY(accountId),
    });
  }
  return data;
};

export const useAddGroupMember = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddGroupMember>>,
      Omit<AddGroupMemberParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddGroupMemberParams,
    Awaited<ReturnType<typeof AddGroupMember>>
  >(AddGroupMember, options, {
    domain: "groups",
    type: "update",
  });
};
