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
 * Endpoint to add a moderator to a specific group.
 * This function allows the addition of a user as a moderator to a specified group by providing the group ID and the account ID of the user.
 * It is designed to be used in applications where group management and user roles are handled.
 * @name AddGroupModerator
 * @param {string} groupId - The id of the group
 * @param {string} accountId - The id of the account to be added as a moderator
 * @version 1.2
 **/

export interface AddGroupModeratorParams extends MutationParams {
  groupId: string;
  accountId: string;
}

export const AddGroupModerator = async ({
  groupId,
  accountId,
  adminApiParams,
  queryClient,
}: AddGroupModeratorParams): Promise<ConnectedXMResponse<GroupMembership>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<GroupMembership>>(
    `/groups/${groupId}/moderators/${accountId}`
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

export const useAddGroupModerator = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddGroupModerator>>,
      Omit<AddGroupModeratorParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddGroupModeratorParams,
    Awaited<ReturnType<typeof AddGroupModerator>>
  >(AddGroupModerator, options, {
    domain: "groups",
    type: "update",
  });
};