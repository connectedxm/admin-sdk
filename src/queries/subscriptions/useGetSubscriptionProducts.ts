import { ConnectedXMResponse } from "@src/interfaces";
import { SubscriptionProduct } from "@src/interfaces";
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
export const SUBSCRIPTION_PRODUCTS_QUERY_KEY = () => ["SUBSCRIPTION_PRODUCTS"];

/**
 * @category Setters
 * @group Subscriptions
 */
export const SET_SUBSCRIPTION_PRODUCTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SUBSCRIPTION_PRODUCTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSubscriptionProducts>>
) => {
  client.setQueryData(SUBSCRIPTION_PRODUCTS_QUERY_KEY(...keyParams), response);
};

interface GetSubscriptionProductsProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group Subscriptions
 */
export const GetSubscriptionProducts = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSubscriptionProductsProps): Promise<
  ConnectedXMResponse<SubscriptionProduct[]>
> => {
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
export const useGetSubscriptionProducts = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSubscriptionProducts>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSubscriptionProducts>>
  >(
    SUBSCRIPTION_PRODUCTS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSubscriptionProducts(params),
    params,
    options,
    "subscriptions"
  );
};
