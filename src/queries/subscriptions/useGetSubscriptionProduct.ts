import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { SubscriptionProduct } from "@src/interfaces";
import { SUBSCRIPTION_PRODUCTS_QUERY_KEY } from "./useGetSubscriptionProducts";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Fetches details for a specific subscription product by its ID.
 * This function utilizes a connected single query to retrieve data about a subscription product.
 * It is designed to be used in applications where detailed information about a subscription product is required.
 * @name GetSubscriptionProduct
 * @param {string} subscriptionProductId - The ID of the subscription product
 * @version 1.2
 **/

export const SUBSCRIPTION_PRODUCT_QUERY_KEY = (
  subscriptionProductId: string
) => [...SUBSCRIPTION_PRODUCTS_QUERY_KEY(), subscriptionProductId];

export const SET_SUBSCRIPTION_PRODUCT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SUBSCRIPTION_PRODUCT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSubscriptionProduct>>
) => {
  client.setQueryData(SUBSCRIPTION_PRODUCT_QUERY_KEY(...keyParams), response);
};

interface GetSubscriptionProductProps extends SingleQueryParams {
  subscriptionProductId: string;
}

export const GetSubscriptionProduct = async ({
  subscriptionProductId,
  adminApiParams,
}: GetSubscriptionProductProps): Promise<
  ConnectedXMResponse<SubscriptionProduct>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/subscription-products/${subscriptionProductId}`
  );
  return data;
};

export const useGetSubscriptionProduct = (
  subscriptionProductId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSubscriptionProduct>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSubscriptionProduct>>(
    SUBSCRIPTION_PRODUCT_QUERY_KEY(subscriptionProductId),
    (params: SingleQueryParams) =>
      GetSubscriptionProduct({ subscriptionProductId, ...params }),
    {
      ...options,
      enabled: !!subscriptionProductId && (options?.enabled ?? true),
    },
    "subscriptions"
  );
};