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
export interface AddGroupModeratorParams extends MutationParams {
  groupId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Groups
 */
export const AddGroupModerator = async ({
  groupId,
  accountId,
  adminApiParams,
  queryClient,
}: AddGroupModeratorParams): Promise<ConnectedXMResponse<GroupMembership>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<GroupMembership>>(
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

/**
 * @category Mutations
 * @group Groups
 */
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
