import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { OrganizationMembership } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ORGANIZATION_QUERY_KEY } from "./useGetOrganization";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Organization
 */
export const ORGANIZATION_USERS_QUERY_KEY = () => [
  ...ORGANIZATION_QUERY_KEY(),
  "USERS",
];

/**
 * @category Setters
 * @group Organization
 */
export const SET_ORGANIZATION_USERS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_USERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationUsers>>
) => {
  client.setQueryData(ORGANIZATION_USERS_QUERY_KEY(...keyParams), response);
};

interface GetOrganizationUsersProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group Organization
 */
export const GetOrganizationUsers = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetOrganizationUsersProps): Promise<
  ConnectedXMResponse<OrganizationMembership[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/users`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Organization
 */
export const useGetOrganizationUsers = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetOrganizationUsers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetOrganizationUsers>>
  >(
    ORGANIZATION_USERS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetOrganizationUsers(params),
    params,
    options,
    "org"
  );
};
