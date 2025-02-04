import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, GroupInvitation } from "@src/interfaces";
import { GROUP_INVITATIONS_QUERY_KEY } from "@src/queries";
import {
  MutationParams,
  ConnectedXMMutationOptions,
  useConnectedMutation,
} from "../useConnectedMutation";

/**
 * Endpoint to cancel a group invitation.
 * This function allows the cancellation of a specific invitation to a group by providing the group ID and invitation ID.
 * It is useful in scenarios where an invitation needs to be revoked or invalidated.
 * @name CancelGroupInvitation
 * @param {string} groupId - The id of the group
 * @param {string} invitationId - The id of the invitation
 * @version 1.2
 **/

export interface CancelGroupInvitationParams extends MutationParams {
  groupId: string;
  invitationId: string;
}

export const CancelGroupInvitation = async ({
  groupId,
  invitationId,
  adminApiParams,
  queryClient,
}: CancelGroupInvitationParams): Promise<
  ConnectedXMResponse<GroupInvitation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<GroupInvitation>>(
    `/groups/${groupId}/invitations/${invitationId}/cancel`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: GROUP_INVITATIONS_QUERY_KEY(groupId),
    });
  }
  return data;
};

export const useCancelGroupInvitation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CancelGroupInvitation>>,
      Omit<CancelGroupInvitationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CancelGroupInvitationParams,
    Awaited<ReturnType<typeof CancelGroupInvitation>>
  >(CancelGroupInvitation, options, {
    domain: "groups",
    type: "update",
  });
};

export default useCancelGroupInvitation;