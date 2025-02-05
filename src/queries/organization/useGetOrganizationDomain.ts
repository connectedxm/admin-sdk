import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse, DomainDetails } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * Fetches the domain details of an organization.
 * This function is designed to retrieve detailed information about an organization's domain,
 * which can be used in applications that require such data for administrative or display purposes.
 * @name GetOrganizationDomain
 * @version 1.2
 **/

export const ORGANIZATION_DOMAIN_QUERY_KEY = () => ["ORGANIZATION_DOMAIN"];

export const SET_ORGANIZATION_DOMAIN_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_DOMAIN_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationDomain>>
) => {
  client.setQueryData(ORGANIZATION_DOMAIN_QUERY_KEY(...keyParams), response);
};

interface GetOrganizationDomainProps extends SingleQueryParams {}

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