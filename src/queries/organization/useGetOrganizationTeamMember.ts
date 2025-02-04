import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ORGANIZATION_TEAM_MEMBERS_QUERY_KEY } from "./useGetOrganizationTeamMembers";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Fetches details for a specific organization team member by their ID.
 * This function utilizes a connected single query to retrieve data about a team member within an organization.
 * It is designed to be used in applications where detailed information about a team member is required.
 * @name GetOrganizationTeamMember
 * @param {string} teamMemberId - The ID of the team member
 * @version 1.2
 **/

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

interface GetOrganizationTeamMemberProps extends SingleQueryParams {
  teamMemberId: string;
}

export const GetOrganizationTeamMember = async ({
  teamMemberId,
  adminApiParams,
}: GetOrganizationTeamMemberProps) => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/organization/team-members/${teamMemberId}`
  );
  return data;
};

export const useGetOrganizationTeamMember = (
  teamMemberId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetOrganizationTeamMember>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetOrganizationTeamMember>>(
    ORGANIZATION_TEAM_MEMBER_QUERY_KEY(teamMemberId),
    (params: SingleQueryParams) =>
      GetOrganizationTeamMember({ teamMemberId, ...params }),
    {
      ...options,
      enabled: !!teamMemberId && (options?.enabled ?? true),
    },
    "org"
  );
};