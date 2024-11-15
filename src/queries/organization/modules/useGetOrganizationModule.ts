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
 * @category Keys
 * @group Organization
 */
export const ORGANIZATION_MODULE_QUERY_KEY = (
  moduleType: keyof typeof OrganizationModuleType
) => [...ORGANIZATION_MODULES_QUERY_KEY(), moduleType];

/**
 * @category Setters
 * @group Organization
 */
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

/**
 * @category Queries
 * @group Organization
 */
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

/**
 * @category Hooks
 * @group Organization
 */
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
