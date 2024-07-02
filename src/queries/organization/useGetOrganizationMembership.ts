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
 * @category Keys
 * @group Organization
 */
export const ORGANIZATION_MEMBERSHIP_QUERY_KEY = (userId: string) => [
  ...ORGANIZATION_QUERY_KEY(),
  "MEMBERSHIP",
  userId,
];

/**
 * @category Setters
 * @group Organization
 */
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

/**
 * @category Queries
 * @group Organization
 */
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
/**
 * @category Hooks
 * @group Organization
 */
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
    }
  );
};
