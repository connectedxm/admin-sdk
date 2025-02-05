import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  OrganizationModuleType,
  Tier,
} from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { ORGANIZATION_MODULE_QUERY_KEY } from "./useGetOrganizationModule";

/**
 * Endpoint to retrieve the enabled tiers for a specific organization module.
 * This function fetches the tiers that are currently enabled for a given module type within an organization.
 * It is useful for applications that need to display or manage the tiers available for different modules.
 * @name GetOrganizationModuleEnabledTiers
 * @param {keyof typeof OrganizationModuleType} moduleType - The type of the organization module
 * @version 1.2
 **/

export const ORGANIZATION_MODULE_ENABLED_TIERS_QUERY_KEY = (
  moduleType: keyof typeof OrganizationModuleType
) => [...ORGANIZATION_MODULE_QUERY_KEY(moduleType), "ENABLED_TIERS"];

export const SET_ORGANIZATION_MODULE_ENABLED_TIERS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_MODULE_ENABLED_TIERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationModuleEnabledTiers>>
) => {
  client.setQueryData(
    ORGANIZATION_MODULE_ENABLED_TIERS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetOrganizationModuleEnabledTiersProps extends InfiniteQueryParams {
  moduleType: keyof typeof OrganizationModuleType;
}

export const GetOrganizationModuleEnabledTiers = async ({
  moduleType,
  adminApiParams,
}: GetOrganizationModuleEnabledTiersProps): Promise<
  ConnectedXMResponse<Tier[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/organization/modules/${moduleType}/enabledTiers`
  );

  return data;
};

export const useGetOrganizationModuleEnabledTiers = (
  moduleType: keyof typeof OrganizationModuleType,
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetOrganizationModuleEnabledTiers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetOrganizationModuleEnabledTiers>>
  >(
    ORGANIZATION_MODULE_ENABLED_TIERS_QUERY_KEY(moduleType),
    (params: InfiniteQueryParams) =>
      GetOrganizationModuleEnabledTiers({ moduleType, ...params }),
    {},
    options
  );
};