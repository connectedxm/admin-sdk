import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { SubscriptionProductPrice } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { SET_SUBSCRIPTION_PRODUCT_PRICE_QUERY_DATA } from "@context/queries/subscriptions/useGetSubscriptionProductPrice";
import { SUBSCRIPTION_PRODUCT_PRICES_QUERY_KEY } from "@context/queries/subscriptions/useGetSubscriptionProductPrices";

interface CreateSubscriptionProductPriceParams {
  subscriptionProductId: string;
  subscriptionProductPrice: SubscriptionProductPrice;
}

export const CreateSubscriptionProductPrice = async ({
  subscriptionProductId,
  subscriptionProductPrice,
}: CreateSubscriptionProductPriceParams): Promise<
  ConnectedXMResponse<SubscriptionProductPrice>
> => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(
    `/subscription-products/${subscriptionProductId}/prices`,
    subscriptionProductPrice
  );

  return { ...data };
};

export const useCreateSubscriptionProductPrice = (
  subscriptionProductId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<SubscriptionProductPrice>(
    (subscriptionProductPrice) =>
      CreateSubscriptionProductPrice({
        subscriptionProductId,
        subscriptionProductPrice,
      }),
    {
      onSuccess: (
        subscriptionProductPrice: Awaited<
          ReturnType<typeof CreateSubscriptionProductPrice>
        >
      ) => {
        queryClient.invalidateQueries(
          SUBSCRIPTION_PRODUCT_PRICES_QUERY_KEY(subscriptionProductId)
        );
        SET_SUBSCRIPTION_PRODUCT_PRICE_QUERY_DATA(
          queryClient,
          [subscriptionProductId, subscriptionProductPrice?.data?.id],
          subscriptionProductPrice
        );
      },
    }
  );
};

export default useCreateSubscriptionProductPrice;
