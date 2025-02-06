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
 * Endpoint to update a team member's information in the organization.
 * This function allows updating the details of a specific team member within an organization using their ID.
 * It is designed to be used in applications where team member information needs to be modified.
 * @name UpdateOrganizationTeamMember
 * @param {string} teamMemberId (path) - The ID of the team member
 * @param {OrganizationTeamMemberUpdateInputs} teamMember (body) - The updated information for the team member
 * @version 1.3
 **/

export interface UpdateOrganizationTeamMemberParams extends MutationParams {
  teamMemberId: string;
  teamMember: OrganizationTeamMemberUpdateInputs;
}

export const UpdateOrganizationTeamMember = async ({
  teamMemberId,
  teamMember,
  adminApiParams,
  queryClient,
}: UpdateOrganizationTeamMemberParams): Promise<
  ConnectedXMResponse<TeamMember>
> => {
  if (!teamMemberId) throw new Error("teamMemberId is required");
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<TeamMember>>(
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
  >(UpdateOrganizationTeamMember, options, {
    domain: "org",
    type: "update",
  });
};