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
import { OrganizationTeamMemberCreateInputs } from "@src/params";

/**
 * Endpoint to create a new organization team member.
 * This function allows the creation of a new team member within an organization by providing the necessary inputs.
 * It is designed to be used in applications where managing team members is required.
 * @name CreateOrganizationTeamMember
 * @param {OrganizationTeamMemberCreateInputs} teamMember (body) The inputs for creating a team member
 * @version 1.3
 **/

export interface CreateOrganizationTeamMemberParams extends MutationParams {
  teamMember: OrganizationTeamMemberCreateInputs;
}

export const CreateOrganizationTeamMember = async ({
  teamMember,
  adminApiParams,
  queryClient,
}: CreateOrganizationTeamMemberParams): Promise<
  ConnectedXMResponse<TeamMember>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<TeamMember>>(
    `/organization/team-members`,
    teamMember
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ORGANIZATION_TEAM_MEMBERS_QUERY_KEY(),
    });
    SET_ORGANIZATION_TEAM_MEMBER_QUERY_DATA(queryClient, [data.data.id], data);
  }
  return data;
};

export const useCreateOrganizationTeamMember = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateOrganizationTeamMember>>,
      Omit<CreateOrganizationTeamMemberParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateOrganizationTeamMemberParams,
    Awaited<ReturnType<typeof CreateOrganizationTeamMember>>
  >(CreateOrganizationTeamMember, options, {
    domain: "org",
    type: "update",
  });
};
