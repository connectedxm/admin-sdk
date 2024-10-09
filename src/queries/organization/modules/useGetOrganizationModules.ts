import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, OrganizationModule } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { ORGANIZATION_QUERY_KEY } from "../useGetOrganization";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";

/**
 * @category Keys
 * @group Organization
 */
export const ORGANIZATION_MODULES_QUERY_KEY = () => [
  ...ORGANIZATION_QUERY_KEY(),
  "MODULES",
];

/**
 * @category Setters
 * @group Organization
 */
export const SET_ORGANIZATION_MODULES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_MODULES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationModules>>
) => {
  client.setQueryData(ORGANIZATION_MODULES_QUERY_KEY(...keyParams), response);
};

interface GetOrganizationModulesProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group Organization
 */
export const GetOrganizationModules = async ({
  adminApiParams,
}: GetOrganizationModulesProps): Promise<
  ConnectedXMResponse<OrganizationModule[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/modules`);
  console.log({ data });

  return data;
};
/**
 * @category Hooks
 * @group Organization
 */
export const useGetOrganizationModules = (
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetOrganizationModules>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetOrganizationModules>>
  >(
    ORGANIZATION_MODULES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetOrganizationModules(params),
    {},
    options
  );
};
