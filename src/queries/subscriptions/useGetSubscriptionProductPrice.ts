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
 * @category Keys
 * @group Subscriptions
 */
export const SUBSCRIPTION_PRODUCT_PRICE_QUERY_KEY = (
  subscriptionProductId: string,
  subscriptionProductPriceId: string
) => [
  ...SUBSCRIPTION_PRODUCT_PRICES_QUERY_KEY(subscriptionProductId),
  subscriptionProductPriceId,
];

/**
 * @category Setters
 * @group Subscriptions
 */
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

/**
 * @category Queries
 * @group Subscriptions
 */
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
/**
 * @category Hooks
 * @group Subscriptions
 */
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
