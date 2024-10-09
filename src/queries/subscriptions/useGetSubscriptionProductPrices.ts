import { ConnectedXMResponse } from "@src/interfaces";
import { SubscriptionProductPrice } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { SUBSCRIPTION_PRODUCT_QUERY_KEY } from "./useGetSubscriptionProduct";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Subscriptions
 */
export const SUBSCRIPTION_PRODUCT_PRICES_QUERY_KEY = (
  subscriptionProductId: string
) => [
  ...SUBSCRIPTION_PRODUCT_QUERY_KEY(subscriptionProductId),
  "SUBSCRIPTION_PRODUCT_PRICES",
];

/**
 * @category Setters
 * @group Subscriptions
 */
export const SET_SUBSCRIPTION_PRODUCT_PRICES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SUBSCRIPTION_PRODUCT_PRICES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSubscriptionProductPrices>>
) => {
  client.setQueryData(
    SUBSCRIPTION_PRODUCT_PRICES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetSubscriptionProductPricesProps extends InfiniteQueryParams {
  subscriptionProductId: string;
}

/**
 * @category Queries
 * @group Subscriptions
 */
export const GetSubscriptionProductPrices = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  subscriptionProductId,
  adminApiParams,
}: GetSubscriptionProductPricesProps): Promise<
  ConnectedXMResponse<SubscriptionProductPrice[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/subscription-products/${subscriptionProductId}/prices`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};
/**
 * @category Hooks
 * @group Subscriptions
 */
export const useGetSubscriptionProductPrices = (
  subscriptionProductId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSubscriptionProductPrices>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSubscriptionProductPrices>>
  >(
    SUBSCRIPTION_PRODUCT_PRICES_QUERY_KEY(subscriptionProductId),
    (params: InfiniteQueryParams) =>
      GetSubscriptionProductPrices({ ...params, subscriptionProductId }),
    params,
    {
      ...options,
      enabled: !!subscriptionProductId && (options.enabled ?? true),
    },
    "subscriptions"
  );
};
