import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { OrganizationMembership } from "@src/interfaces";
import { ORGANIZATION_QUERY_KEY } from "./useGetOrganization";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Endpoint to retrieve organization membership data for a specific user.
 * This function allows applications to fetch detailed membership information of a user within an organization.
 * It is designed to be used in scenarios where user membership details are required for organizational management.
 * @name GetOrganizationMembership
 * @param {string} userId (path) The id of the user
 * @version 1.3
 **/

export const ORGANIZATION_MEMBERSHIP_QUERY_KEY = (userId: string) => [
  ...ORGANIZATION_QUERY_KEY(),
  "MEMBERSHIP",
  userId,
];

export const SET_ORGANIZATION_MEMBERSHIP_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_MEMBERSHIP_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationMembership>>
) => {
  client.setQueryData(
    ORGANIZATION_MEMBERSHIP_QUERY_KEY(...keyParams),
    response
  );
};

interface GetOrganizationMembershipProps extends SingleQueryParams {
  userId: string;
}

export const GetOrganizationMembership = async ({
  userId,
  adminApiParams,
}: GetOrganizationMembershipProps): Promise<
  ConnectedXMResponse<OrganizationMembership>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/users/${userId}`);
  return data;
};

export const useGetOrganizationMembership = (
  userId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetOrganizationMembership>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetOrganizationMembership>>(
    ORGANIZATION_MEMBERSHIP_QUERY_KEY(userId),
    (params: SingleQueryParams) =>
      GetOrganizationMembership({ userId, ...params }),
    {
      ...options,
      enabled: !!userId && (options?.enabled ?? true),
    },
    "org"
  );
};