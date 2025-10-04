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
 * @category Params
 * @group Groups
 */
export interface AddGroupMemberParams extends MutationParams {
  groupId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Groups
 */
export const AddGroupMember = async ({
  groupId,
  accountId,
  adminApiParams,
  queryClient,
}: AddGroupMemberParams): Promise<ConnectedXMResponse<GroupMembership>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<GroupMembership>>(
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

/**
 * @category Mutations
 * @group Groups
 */
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
  >(AddGroupMember, options);
};
