import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { TeamMember, ConnectedXMResponse } from "@src/interfaces";
import {
  ORGANIZATION_TEAM_MEMBERS_QUERY_KEY,
  SET_ORGANIZATION_TEAM_MEMBER_QUERY_DATA,
} from "@src/queries";
import { OrganizationTeamMemberUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Organization
 */
export interface UpdateOrganizationTeamMemberParams extends MutationParams {
  teamMemberId: string;
  teamMember: OrganizationTeamMemberUpdateInputs;
}

/**
 * @category Methods
 * @group Organization
 */
export const UpdateOrganizationTeamMember = async ({
  teamMemberId,
  teamMember,
  adminApiParams,
  queryClient,
}: UpdateOrganizationTeamMemberParams): Promise<
  ConnectedXMResponse<TeamMember>
> => {
  if (!teamMemberId) throw new Error("teamMemberId is required");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<TeamMember>>(
    `/organization/team-members/${teamMemberId}`,
    {
      ...teamMember,
      id: undefined,
      image: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ORGANIZATION_TEAM_MEMBERS_QUERY_KEY(),
    });
    SET_ORGANIZATION_TEAM_MEMBER_QUERY_DATA(
      queryClient,
      [teamMemberId || data.data.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization
 */
export const useUpdateOrganizationTeamMember = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateOrganizationTeamMember>>,
      Omit<UpdateOrganizationTeamMemberParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateOrganizationTeamMemberParams,
    Awaited<ReturnType<typeof UpdateOrganizationTeamMember>>
  >(UpdateOrganizationTeamMember, options);
};
