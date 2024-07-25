import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Purchase } from "@src/interfaces";

import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";

import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Purchases
 */
export const PURCHASES_QUERY_KEY = () => ["PURCHASES"];

/**
 * @category Setters
 * @group Purchases
 */
export const SET_PURCHASES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof PURCHASES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetPurchases>>
) => {
  client.setQueryData(PURCHASES_QUERY_KEY(...keyParams), response);
};

interface GetPurchasesProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group Purchases
 */
export const GetPurchases = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetPurchasesProps): Promise<ConnectedXMResponse<Purchase[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/purchases`, {
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
 * @group Purchases
 */
export const useGetPurchases = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetPurchases>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetPurchases>>>(
    PURCHASES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetPurchases(params),
    params,
    options
  );
};
