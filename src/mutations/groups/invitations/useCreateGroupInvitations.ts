import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { GroupInvitation, ConnectedXMResponse } from "@src/interfaces";
import { GROUP_INVITATIONS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Groups
 */
export interface CreateGroupInvitationsParams extends MutationParams {
  groupId: string;
  moderatorId: string;
  accountIds: string[];
}

/**
 * @category Methods
 * @group Groups
 */
export const CreateGroupInvitations = async ({
  groupId,
  moderatorId,
  accountIds,
  adminApiParams,
  queryClient,
}: CreateGroupInvitationsParams): Promise<
  ConnectedXMResponse<GroupInvitation[]>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<GroupInvitation[]>
  >(`/groups/${groupId}/invitations`, { moderatorId, accountIds });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: GROUP_INVITATIONS_QUERY_KEY(groupId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Groups
 */
export const useCreateGroupInvitations = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateGroupInvitations>>,
      Omit<CreateGroupInvitationsParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateGroupInvitationsParams,
    Awaited<ReturnType<typeof CreateGroupInvitations>>
  >(CreateGroupInvitations, options);
};
