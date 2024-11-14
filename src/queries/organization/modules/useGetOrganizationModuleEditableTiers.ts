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
export const ORGANIZATION_MODULE_EDITABLE_TIERS_QUERY_KEY = (
  moduleType: keyof typeof OrganizationModuleType
) => [...ORGANIZATION_MODULE_QUERY_KEY(moduleType), "EDITABLE_TIERS"];

/**
 * @category Setters
 * @group Organization
 */
export const SET_ORGANIZATION_MODULE_EDITABLE_TIERS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_MODULE_EDITABLE_TIERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationModuleEditableTiers>>
) => {
  client.setQueryData(
    ORGANIZATION_MODULE_EDITABLE_TIERS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetOrganizationModuleEditableTiersProps extends InfiniteQueryParams {
  moduleType: keyof typeof OrganizationModuleType;
}

/**
 * @category Queries
 * @group Organization
 */
export const GetOrganizationModuleEditableTiers = async ({
  moduleType,
  adminApiParams,
}: GetOrganizationModuleEditableTiersProps): Promise<
  ConnectedXMResponse<OrganizationModule[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/organization/modules/${moduleType}/editableTiers`
  );

  return data;
};

/**
 * @category Hooks
 * @group Organization
 */
export const useGetOrganizationModuleEditableTiers = (
  moduleType: keyof typeof OrganizationModuleType,
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetOrganizationModuleEditableTiers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetOrganizationModuleEditableTiers>>
  >(
    ORGANIZATION_MODULE_EDITABLE_TIERS_QUERY_KEY(moduleType),
    (params: InfiniteQueryParams) =>
      GetOrganizationModuleEditableTiers({ moduleType, ...params }),
    {},
    options
  );
};
