import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  OrganizationModule,
  OrganizationModuleType,
} from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { ORGANIZATION_MODULE_QUERY_KEY } from "./useGetOrganizationModule";

/**
 * @category Keys
 * @group Organization
 */
export const ORGANIZATION_MODULE_ENABLED_TIERS_QUERY_KEY = (
  moduleType: keyof typeof OrganizationModuleType
) => [...ORGANIZATION_MODULE_QUERY_KEY(moduleType), "ENABLED_TIERS"];

/**
 * @category Setters
 * @group Organization
 */
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

/**
 * @category Queries
 * @group Organization
 */
export const GetOrganizationModuleEnabledTiers = async ({
  moduleType,
  adminApiParams,
}: GetOrganizationModuleEnabledTiersProps): Promise<
  ConnectedXMResponse<OrganizationModule[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/organization/modules/${moduleType}/enabledTiers`
  );

  return data;
};

/**
 * @category Hooks
 * @group Organization
 */
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
