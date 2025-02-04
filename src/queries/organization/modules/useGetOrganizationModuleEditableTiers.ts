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
 * Fetches editable tiers for a specified organization module type.
 * This function is used to retrieve a list of tiers that can be edited within a given organization module.
 * It is particularly useful for applications that need to manage or display editable tiers for different modules.
 * @name GetOrganizationModuleEditableTiers
 * @param {keyof typeof OrganizationModuleType} moduleType - The type of the organization module
 * @version 1.2
 **/

export const ORGANIZATION_MODULE_EDITABLE_TIERS_QUERY_KEY = (
  moduleType: keyof typeof OrganizationModuleType
) => [...ORGANIZATION_MODULE_QUERY_KEY(moduleType), "EDITABLE_TIERS"];

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

export const GetOrganizationModuleEditableTiers = async ({
  moduleType,
  adminApiParams,
}: GetOrganizationModuleEditableTiersProps): Promise<
  ConnectedXMResponse<Tier[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/organization/modules/${moduleType}/editableTiers`
  );

  return data;
};

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