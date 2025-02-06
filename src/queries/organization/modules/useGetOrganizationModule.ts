import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import {
  ConnectedXMResponse,
  OrganizationModule,
  OrganizationModuleType,
} from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { ORGANIZATION_MODULES_QUERY_KEY } from "./useGetOrganizationModules";

/**
 * Provides functionality to query and manage organization modules.
 * This module includes functions to fetch, cache, and utilize organization module data
 * based on the specified module type. It is designed to be used in applications
 * that require interaction with different types of organization modules.
 * @name GetOrganizationModule
 * @param {keyof typeof OrganizationModuleType} moduleType (path) The type of the organization module
 * @version 1.3
 **/

export const ORGANIZATION_MODULE_QUERY_KEY = (
  moduleType: keyof typeof OrganizationModuleType
) => [...ORGANIZATION_MODULES_QUERY_KEY(), moduleType];

export const SET_ORGANIZATION_MODULE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_MODULE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationModule>>
) => {
  client.setQueryData(ORGANIZATION_MODULE_QUERY_KEY(...keyParams), response);
};

interface GetOrganizationModuleProps extends SingleQueryParams {
  moduleType: keyof typeof OrganizationModuleType;
}

export const GetOrganizationModule = async ({
  moduleType,
  adminApiParams,
}: GetOrganizationModuleProps): Promise<
  ConnectedXMResponse<OrganizationModule>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/modules/${moduleType}`);
  return data;
};

export const useGetOrganizationModule = (
  moduleType: keyof typeof OrganizationModuleType,
  options: SingleQueryOptions<ReturnType<typeof GetOrganizationModule>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetOrganizationModule>>(
    ORGANIZATION_MODULE_QUERY_KEY(moduleType),
    (params: SingleQueryParams) =>
      GetOrganizationModule({ moduleType, ...params }),
    {
      enabled: !!moduleType && (options.enabled ?? true),
      ...options,
    },
    "org"
  );
};