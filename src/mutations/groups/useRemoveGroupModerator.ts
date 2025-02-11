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
 * Endpoint to remove a moderator from a specified group.
 * This function allows the removal of a moderator from a group by providing the group ID and the account ID of the moderator.
 * It is used in scenarios where group moderation needs to be updated or modified.
 * @name RemoveGroupModerator
 * @param {string} groupId (path) The ID of the group
 * @param {string} accountId (path) The ID of the account
 * @version 1.3
 **/

export interface RemoveGroupModeratorParams extends MutationParams {
  groupId: string;
  accountId: string;
}

export const RemoveGroupModerator = async ({
  groupId,
  accountId,
  adminApiParams,
  queryClient,
}: RemoveGroupModeratorParams): Promise<
  ConnectedXMResponse<GroupMembership>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<GroupMembership>>(
    `/groups/${groupId}/moderators/${accountId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: GROUP_MODERATORS_QUERY_KEY(groupId),
    });
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_GROUPS_QUERY_KEY(accountId),
    });
    queryClient.invalidateQueries({
      queryKey: GROUP_MEMBERS_QUERY_KEY(groupId),
    });
  }
  return data;
};

export const useRemoveGroupModerator = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveGroupModerator>>,
      Omit<RemoveGroupModeratorParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveGroupModeratorParams,
    Awaited<ReturnType<typeof RemoveGroupModerator>>
  >(RemoveGroupModerator, options, {
    domain: "groups",
    type: "update",
  });
};
