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
 * Deletes a team member from an organization.
 * This function allows for the removal of a specified team member by their ID from an organization's team.
 * It is intended for use in administrative contexts where managing team membership is required.
 * @name DeleteOrganizationTeamMember
 * @param {string} teamMemberId (path) - The ID of the team member to be deleted
 * @version 1.3
 **/

export interface DeleteOrganizationTeamMemberParams extends MutationParams {
  teamMemberId: string;
}

export const DeleteOrganizationTeamMember = async ({
  teamMemberId,
  adminApiParams,
  queryClient,
}: DeleteOrganizationTeamMemberParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
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
  >(DeleteOrganizationTeamMember, options, {
    domain: "org",
    type: "update",
  });
};