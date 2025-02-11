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
 * Fetches organization data from the server.
 * This function is designed to retrieve detailed information about an organization.
 * It is intended for use in applications that require access to organization-level data.
 * @name GetOrganization
 * @version 1.3
 **/

export const ORGANIZATION_QUERY_KEY = () => ["ORGANIZATION"];

export const SET_ORGANIZATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganization>>
) => {
  client.setQueryData(ORGANIZATION_QUERY_KEY(...keyParams), response);
};

interface GetOrganizationProps extends SingleQueryParams {}

export const GetOrganization = async ({
  adminApiParams,
}: GetOrganizationProps): Promise<ConnectedXMResponse<Organization>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization`);
  return data;
};

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