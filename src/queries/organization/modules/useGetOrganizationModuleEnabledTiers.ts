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
 * This file contains functions for retrieving and managing organization module enabled tiers.
 * It provides endpoints for fetching enabled tiers for a specific organization module and updating the query data.
 * The functions in this file are designed to be used in applications that need to display or manage the tiers available for different modules.
 * @name Organization Module Enabled Tiers
 * @param {keyof typeof OrganizationModuleType} moduleType (path) The type of the organization module
 * @version 1.3
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