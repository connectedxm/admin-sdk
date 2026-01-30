import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, GroupInvitation } from "@src/interfaces";
import { GROUP_INVITATIONS_QUERY_KEY } from "@src/queries";
import {
  MutationParams,
  ConnectedXMMutationOptions,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";

/**
 * @category Params
 * @group Groups
 */
export interface CancelGroupInvitationParams extends MutationParams {
  groupId: string;
  invitationId: string;
}

/**
 * @category Methods
 * @group Groups
 */
export const CancelGroupInvitation = async ({
  groupId,
  invitationId,
  adminApiParams,
  queryClient,
}: CancelGroupInvitationParams): Promise<
  ConnectedXMResponse<GroupInvitation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<GroupInvitation>>(
    `/groups/${groupId}/invitations/${invitationId}/cancel`
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
  >(CancelGroupInvitation, options);
};

export default useCancelGroupInvitation;
