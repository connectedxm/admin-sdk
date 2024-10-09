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
 * @category Keys
 * @group Subscriptions
 */
export const SUBSCRIPTION_PRODUCT_QUERY_KEY = (
  subscriptionProductId: string
) => [...SUBSCRIPTION_PRODUCTS_QUERY_KEY(), subscriptionProductId];

/**
 * @category Setters
 * @group Subscriptions
 */
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

/**
 * @category Queries
 * @group Subscriptions
 */
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
/**
 * @category Hooks
 * @group Subscriptions
 */
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
