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
 * Endpoint to retrieve a list of prices for a specific subscription product.
 * This function allows users to fetch detailed pricing information associated with a subscription product.
 * It is designed to be used in applications where pricing details of subscription products are required.
 * @name GetSubscriptionProductPrices
 * @param {string} subscriptionProductId (path) The id of the subscription product
 * @version 1.3
 **/

export const SUBSCRIPTION_PRODUCT_PRICES_QUERY_KEY = (
  subscriptionProductId: string
) => [
  ...SUBSCRIPTION_PRODUCT_QUERY_KEY(subscriptionProductId),
  "SUBSCRIPTION_PRODUCT_PRICES",
];

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