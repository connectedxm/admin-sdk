import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Organization } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Organization
 */
export const ORGANIZATION_QUERY_KEY = () => ["ORGANIZATION"];

/**
 * @category Setters
 * @group Organization
 */
export const SET_ORGANIZATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganization>>
) => {
  client.setQueryData(ORGANIZATION_QUERY_KEY(...keyParams), response);
};

interface GetOrganizationProps extends SingleQueryParams {}

/**
 * @category Queries
 * @group Organization
 */
export const GetOrganization = async ({
  adminApiParams,
}: GetOrganizationProps): Promise<ConnectedXMResponse<Organization>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization`);
  return data;
};
/**
 * @category Hooks
 * @group Organization
 */
export const useGetOrganization = (
  options: SingleQueryOptions<ReturnType<typeof GetOrganization>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetOrganization>>(
    ORGANIZATION_QUERY_KEY(),
    (params: SingleQueryParams) => GetOrganization(params),
    options,
    "org"
  );
};
