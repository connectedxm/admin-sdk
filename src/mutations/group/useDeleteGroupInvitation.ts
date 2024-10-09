import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { GROUP_INVITATIONS_QUERY_KEY } from "@src/queries";
import {
  MutationParams,
  ConnectedXMMutationOptions,
  useConnectedMutation,
} from "../useConnectedMutation";

/**
 * @category Params
 * @group Groups
 */
export interface DeleteGroupInvitationParams extends MutationParams {
  groupId: string;
  invitationId: string;
}

/**
 * @category Methods
 * @group Groups
 */
export const DeleteGroupInvitation = async ({
  groupId,
  invitationId,
  adminApiParams,
  queryClient,
}: DeleteGroupInvitationParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/groups/${groupId}/invitations/${invitationId}`
  );
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
