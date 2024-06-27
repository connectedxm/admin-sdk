import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ORGANIZATION_TEAM_MEMBERS_QUERY_KEY,
  ORGANIZATION_TEAM_MEMBER_QUERY_KEY,
} from "@src/queries";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";

/**
 * @category Params
 * @group Organization
 */
export interface DeleteOrganizationTeamMemberParams extends MutationParams {
  teamMemberId: string;
}

/**
 * @category Methods
 * @group Organization
 */
export const DeleteOrganizationTeamMember = async ({
  teamMemberId,
  adminApiParams,
  queryClient,
}: DeleteOrganizationTeamMemberParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/organization/team-members/${teamMemberId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ORGANIZATION_TEAM_MEMBERS_QUERY_KEY(),
    });
    queryClient.removeQueries({
      queryKey: ORGANIZATION_TEAM_MEMBER_QUERY_KEY(teamMemberId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization
 */
export const useDeleteOrganizationTeamMember = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteOrganizationTeamMember>>,
      Omit<DeleteOrganizationTeamMemberParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteOrganizationTeamMemberParams,
    Awaited<ReturnType<typeof DeleteOrganizationTeamMember>>
  >(DeleteOrganizationTeamMember, options);
};
