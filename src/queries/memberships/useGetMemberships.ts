import { ConnectedXMResponse } from "@src/interfaces";
import { Membership } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Subscriptions
 */
export const MEMBERSHIPS_QUERY_KEY = () => ["MEMBERSHIPS"];

/**
 * @category Setters
 * @group Subscriptions
 */
export const SET_MEMBERSHIPS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MEMBERSHIPS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetMemberships>>
) => {
  client.setQueryData(MEMBERSHIPS_QUERY_KEY(...keyParams), response);
};

interface GetMembershipsProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group Subscriptions
 */
export const GetMemberships = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetMembershipsProps): Promise<ConnectedXMResponse<Membership[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/subscription-products`, {
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
 * @group Subscriptions
 */
export const useGetMemberships = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetMemberships>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetMemberships>>>(
    MEMBERSHIPS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetMemberships(params),
    params,
    options,
    "subscriptions"
  );
};
