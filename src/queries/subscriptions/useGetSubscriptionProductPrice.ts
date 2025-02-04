import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { SubscriptionProductPrice } from "@src/interfaces";
import { SUBSCRIPTION_PRODUCT_PRICES_QUERY_KEY } from "./useGetSubscriptionProductPrices";
import { QueryClient } from "@tanstack/react-query";

/**
 * Fetches a specific subscription product price by its unique identifier.
 * This function is used to retrieve detailed information about a particular subscription product price within a subscription product.
 * It is designed for applications that require access to specific pricing details of subscription products.
 * @name GetSubscriptionProductPrice
 * @param {string} subscriptionProductId - The ID of the subscription product
 * @param {string} subscriptionProductPriceId - The ID of the subscription product price
 * @version 1.2
 **/

export const SUBSCRIPTION_PRODUCT_PRICE_QUERY_KEY = (
  subscriptionProductId: string,
  subscriptionProductPriceId: string
) => [
  ...SUBSCRIPTION_PRODUCT_PRICES_QUERY_KEY(subscriptionProductId),
  subscriptionProductPriceId,
];

export const SET_SUBSCRIPTION_PRODUCT_PRICE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SUBSCRIPTION_PRODUCT_PRICE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSubscriptionProductPrice>>
) => {
  client.setQueryData(
    SUBSCRIPTION_PRODUCT_PRICE_QUERY_KEY(...keyParams),
    response
  );
};

interface GetSubscriptionProductPriceProps extends SingleQueryParams {
  subscriptionProductId: string;
  subscriptionProductPriceId: string;
}

export const GetSubscriptionProductPrice = async ({
  subscriptionProductId,
  subscriptionProductPriceId,
  adminApiParams,
}: GetSubscriptionProductPriceProps): Promise<
  ConnectedXMResponse<SubscriptionProductPrice>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/subscription-products/${subscriptionProductId}/prices/${subscriptionProductPriceId}`
  );
  return data;
};

export const useGetSubscriptionProductPrice = (
  subscriptionProductId: string = "",
  subscriptionProductPriceId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetSubscriptionProductPrice>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetSubscriptionProductPrice>
  >(
    SUBSCRIPTION_PRODUCT_PRICE_QUERY_KEY(
      subscriptionProductId,
      subscriptionProductPriceId
    ),
    (params: SingleQueryParams) =>
      GetSubscriptionProductPrice({
        subscriptionProductId,
        subscriptionProductPriceId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!subscriptionProductId &&
        !!subscriptionProductPriceId &&
        (options?.enabled ?? true),
    },
    "subscriptions"
  );
};