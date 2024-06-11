import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Organization } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Self
 */
export const SELF_ORGANIZATIONS_QUERY_KEY = () => [
  ...SELF_QUERY_KEY(),
  "ORGANIZATIONS",
];

/**
 * @category Setters
 * @group Self
 */
export const SET_SELF_ORGANIZATIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_ORGANIZATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfOrganizations>>
) => {
  client.setQueryData(SELF_ORGANIZATIONS_QUERY_KEY(...keyParams), response);
};

interface GetSelfOrganizationsProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group Self
 */
export const GetSelfOrganizations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSelfOrganizationsProps): Promise<ConnectedXMResponse<Organization[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/self/organizations`, {
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
 * @group Self
 */
export const useGetSelfOrganizations = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfOrganizations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfOrganizations>>
  >(
    SELF_ORGANIZATIONS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfOrganizations(params),
    params,
    options
  );
};
