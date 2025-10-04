import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, GroupInvitation } from "@src/interfaces";
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
export interface ReinviteGroupInvitationParams extends MutationParams {
  groupId: string;
  invitationId: string;
}

/**
 * @category Methods
 * @group Groups
 */
export const ReinviteGroupInvitation = async ({
  groupId,
  invitationId,
  adminApiParams,
  queryClient,
}: ReinviteGroupInvitationParams): Promise<
  ConnectedXMResponse<GroupInvitation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<GroupInvitation>>(
    `/groups/${groupId}/invitations/${invitationId}/reinvite`
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
  >(ReinviteGroupInvitation, options);
};

export default useReinviteGroupInvitation;
