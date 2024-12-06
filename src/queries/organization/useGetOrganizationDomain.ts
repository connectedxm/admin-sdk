import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse, DomainDetails } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Organization
 */
export const ORGANIZATION_DOMAIN_QUERY_KEY = () => ["ORGANIZATION_DOMAIN"];

/**
 * @category Setters
 * @group Organization
 */
export const SET_ORGANIZATION_DOMAIN_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_DOMAIN_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationDomain>>
) => {
  client.setQueryData(ORGANIZATION_DOMAIN_QUERY_KEY(...keyParams), response);
};

interface GetOrganizationDomainProps extends SingleQueryParams {}

/**
 * @category Queries
 * @group Organization
 */
export const GetOrganizationDomain = async ({
  adminApiParams,
}: GetOrganizationDomainProps): Promise<
  ConnectedXMResponse<DomainDetails | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get<
    ConnectedXMResponse<DomainDetails | null>
  >(`/organization/domain`);
  return data;
};
/**
 * @category Hooks
 * @group Organization
 */
export const useGetOrganizationDomain = (
  options: SingleQueryOptions<ReturnType<typeof GetOrganizationDomain>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetOrganizationDomain>>(
    ORGANIZATION_DOMAIN_QUERY_KEY(),
    (params: SingleQueryParams) => GetOrganizationDomain(params),
    options,
    "org"
  );
};
