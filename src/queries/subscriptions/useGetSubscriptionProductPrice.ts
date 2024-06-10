import { GetAdminAPI } from '@src/AdminAPI';
import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { SubscriptionProductPrice } from "@src/interfaces";
import { SUBSCRIPTION_PRODUCT_PRICES_QUERY_KEY } from "./useGetSubscriptionProductPrices";
import { QueryClient } from "@tanstack/react-query";

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

interface GetSubscriptionProductPriceProps {
  subscriptionProductId: string;
  subscriptionProductPriceId: string;
}

export const GetSubscriptionProductPrice = async ({
  subscriptionProductId,
  subscriptionProductPriceId,
}: GetSubscriptionProductPriceProps): Promise<
  ConnectedXMResponse<SubscriptionProductPrice>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/subscription-products/${subscriptionProductId}/prices/${subscriptionProductPriceId}`
  );
  return data;
};

const useGetSubscriptionProductPrice = (
  subscriptionProductId: string,
  subscriptionProductPriceId: string
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSubscriptionProductPrice>>((
    SUBSCRIPTION_PRODUCT_PRICE_QUERY_KEY(
      subscriptionProductId,
      subscriptionProductPriceId
    ),
    () =>
      GetSubscriptionProductPrice({
        subscriptionProductId,
        subscriptionProductPriceId,
      }),
    {
      enabled: !!subscriptionProductId && !!subscriptionProductPriceId,
    }
  );
};

export default useGetSubscriptionProductPrice;
