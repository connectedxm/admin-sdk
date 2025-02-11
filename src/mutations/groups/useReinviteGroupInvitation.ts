import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, GroupInvitation } from "@src/interfaces";
import { GROUP_INVITATIONS_QUERY_KEY } from "@src/queries";
import {
  MutationParams,
  ConnectedXMMutationOptions,
  useConnectedMutation,
} from "../useConnectedMutation";

/**
 * Endpoint to reinvite a group member with a pending invitation.
 * This function allows the reinvitation of a group member whose invitation is still pending.
 * It updates the invitation status and ensures the group member receives a new invitation.
 * @name PutReinviteGroupInvitation
 * @param {string} groupId (path) The id of the group
 * @param {string} invitationId (path) The id of the invitation
 * @version 1.3
 **/

export interface ReinviteGroupInvitationParams extends MutationParams {
  groupId: string;
  invitationId: string;
}

export const ReinviteGroupInvitation = async ({
  groupId,
  invitationId,
  adminApiParams,
  queryClient,
}: ReinviteGroupInvitationParams): Promise<
  ConnectedXMResponse<GroupInvitation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<GroupInvitation>>(
    `/groups/${groupId}/invitations/${invitationId}/reinvite`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: GROUP_INVITATIONS_QUERY_KEY(groupId),
    });
  }
  return data;
};

export const useReinviteGroupInvitation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ReinviteGroupInvitation>>,
      Omit<ReinviteGroupInvitationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ReinviteGroupInvitationParams,
    Awaited<ReturnType<typeof ReinviteGroupInvitation>>
  >(ReinviteGroupInvitation, options, {
    domain: "groups",
    type: "update",
  });
};

export default useReinviteGroupInvitation;
