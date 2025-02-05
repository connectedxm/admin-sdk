import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { GROUP_INVITATIONS_QUERY_KEY } from "@src/queries";
import {
  MutationParams,
  ConnectedXMMutationOptions,
  useConnectedMutation,
} from "../useConnectedMutation";

/**
 * Endpoint to delete a group invitation.
 * This function allows the removal of a specific invitation from a group by providing the group ID and invitation ID.
 * It is used in scenarios where managing group memberships and invitations is required.
 * @name DeleteGroupInvitation
 * @param {string} groupId - The id of the group
 * @param {string} invitationId - The id of the invitation
 * @version 1.2
 **/

export interface DeleteGroupInvitationParams extends MutationParams {
  groupId: string;
  invitationId: string;
}

export const DeleteGroupInvitation = async ({
  groupId,
  invitationId,
  adminApiParams,
  queryClient,
}: DeleteGroupInvitationParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/groups/${groupId}/invitations/${invitationId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: GROUP_INVITATIONS_QUERY_KEY(groupId),
    });
  }
  return data;
};

export const useDeleteGroupInvitation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteGroupInvitation>>,
      Omit<DeleteGroupInvitationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteGroupInvitationParams,
    Awaited<ReturnType<typeof DeleteGroupInvitation>>
  >(DeleteGroupInvitation, options, {
    domain: "groups",
    type: "update",
  });
};

export default useDeleteGroupInvitation;