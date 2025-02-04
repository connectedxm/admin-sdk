import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, OrganizationMembership } from "@src/interfaces";

/**
 * Endpoint to fetch and manage the current user's organization membership data.
 * This function allows users to retrieve their own organization membership details.
 * It is designed to be used in applications where users need to access or manage their membership information.
 * @name GetSelfOrgMembership
 * @version 1.2
 **/

export const SELF_MEMBERSHIP_QUERY_KEY = () => [
  ...SELF_QUERY_KEY(),
  "MEMBERSHIP",
];

export const SET_SELF_MEMBERSHIP_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_MEMBERSHIP_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfOrgMembership>>
) => {
  client.setQueryData(SELF_MEMBERSHIP_QUERY_KEY(...keyParams), response);
};

interface GetSelfOrgMembershipProps extends SingleQueryParams {}

export const GetSelfOrgMembership = async ({
  adminApiParams,
}: GetSelfOrgMembershipProps): Promise<
  ConnectedXMResponse<OrganizationMembership>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/self/organization-membership`);
  return data;
};

export const useGetSelfOrgMembership = (
  options: SingleQueryOptions<ReturnType<typeof GetSelfOrgMembership>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSelfOrgMembership>>(
    SELF_MEMBERSHIP_QUERY_KEY(),
    (params: SingleQueryParams) => GetSelfOrgMembership({ ...params }),
    options
  );
};