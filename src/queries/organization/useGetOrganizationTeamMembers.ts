import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { TeamMember } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ORGANIZATION_QUERY_KEY } from "./useGetOrganization";
import { QueryClient } from "@tanstack/react-query";

/**
 * Endpoint to retrieve a list of team members within an organization.
 * This function fetches a paginated list of team members, allowing for optional sorting and searching.
 * It is designed to be used in applications that require displaying or managing organization team members.
 * @name GetOrganizationTeamMembers
 * @version 1.2
 **/

export const ORGANIZATION_TEAM_MEMBERS_QUERY_KEY = () => [
  ...ORGANIZATION_QUERY_KEY(),
  "TEAM_MEMBERS",
];

export const SET_ORGANIZATION_TEAM_MEMBERS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_TEAM_MEMBERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationTeamMembers>>
) => {
  client.setQueryData(
    ORGANIZATION_TEAM_MEMBERS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetOrganizationTeamMembersProps extends InfiniteQueryParams {}

export const GetOrganizationTeamMembers = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetOrganizationTeamMembersProps): Promise<
  ConnectedXMResponse<TeamMember[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/team-members`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetOrganizationTeamMembers = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetOrganizationTeamMembers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetOrganizationTeamMembers>>
  >(
    ORGANIZATION_TEAM_MEMBERS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetOrganizationTeamMembers(params),
    params,
    options,
    "org"
  );
};