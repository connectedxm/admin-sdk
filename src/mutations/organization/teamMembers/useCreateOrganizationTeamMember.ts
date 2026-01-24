import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { TeamMember, ConnectedXMResponse } from "@src/interfaces";
import {
  ORGANIZATION_TEAM_MEMBERS_QUERY_KEY,
  SET_ORGANIZATION_TEAM_MEMBER_QUERY_DATA,
} from "@src/queries";
import { OrganizationTeamMemberCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Organization
 */
export interface CreateOrganizationTeamMemberParams extends MutationParams {
  teamMember: OrganizationTeamMemberCreateInputs;
}

/**
 * @category Methods
 * @group Organization
 */
export const CreateOrganizationTeamMember = async ({
  teamMember,
  adminApiParams,
  queryClient,
}: CreateOrganizationTeamMemberParams): Promise<
  ConnectedXMResponse<TeamMember>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<TeamMember>>(
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

/**
 * @category Mutations
 * @group Organization
 */
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
  >(CreateOrganizationTeamMember, options);
};
