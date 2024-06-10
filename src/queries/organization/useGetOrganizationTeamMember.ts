import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { TeamMember } from "@src/interfaces";
import { ORGANIZATION_TEAM_MEMBERS_QUERY_KEY } from "./useGetOrganizationTeamMembers";
import { QueryClient } from "@tanstack/react-query";

export const ORGANIZATION_TEAM_MEMBER_QUERY_KEY = (teamMemberId: string) => [
  ...ORGANIZATION_TEAM_MEMBERS_QUERY_KEY(),
  teamMemberId,
];

export const SET_ORGANIZATION_TEAM_MEMBER_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_TEAM_MEMBER_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationTeamMember>>
) => {
  client.setQueryData(
    ORGANIZATION_TEAM_MEMBER_QUERY_KEY(...keyParams),
    response
  );
};

interface GetOrganizationTeamMemberProps {
  teamMemberId: string;
}

export const GetOrganizationTeamMember = async ({
  teamMemberId,
}: GetOrganizationTeamMemberProps) => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/organization/team-members/${teamMemberId}`
  );
  return data;
};

const useGetOrganizationTeamMember = (teamMemberId: string) => {
  return useConnectedSingleQuery<ConnectedXMResponse<TeamMember>>(
    ORGANIZATION_TEAM_MEMBER_QUERY_KEY(teamMemberId),
    () => GetOrganizationTeamMember({ teamMemberId }),
    {}
  );
};

export default useGetOrganizationTeamMember;
