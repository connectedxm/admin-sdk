import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ORGANIZATION_TEAM_MEMBERS_QUERY_KEY } from "./useGetOrganizationTeamMembers";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Organization
 */
export const ORGANIZATION_TEAM_MEMBER_QUERY_KEY = (teamMemberId: string) => [
  ...ORGANIZATION_TEAM_MEMBERS_QUERY_KEY(),
  teamMemberId,
];

/**
 * @category Setters
 * @group Organization
 */
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

/**
 * @category Queries
 * @group Organization
 */
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
/**
 * @category Hooks
 * @group Organization
 */
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
