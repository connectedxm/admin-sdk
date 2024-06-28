import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { SubscriptionProductPrice } from "@interfaces";

interface UpdateSubscriptionProductPriceParams {
  subscriptionProductId: string;
  subscriptionProductPriceId: string;
  subscriptionProductPrice: SubscriptionProductPrice;
}

export const UpdateSubscriptionProductPrice = async ({
  subscriptionProductId,
  subscriptionProductPriceId,
  subscriptionProductPrice,
}: UpdateSubscriptionProductPriceParams): Promise<
  ConnectedXMResponse<SubscriptionProductPrice>
> => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.put(
    `/subscription-products/${subscriptionProductId}/prices/${subscriptionProductPriceId}`,
    subscriptionProductPrice
  );

  return { ...data };
};

export const useUpdateSubscriptionProductPrice = (
  subscriptionProductId: string,
  subscriptionProductPriceId: string
) => {
  return useConnectedMutation<SubscriptionProductPrice>(
    (subscriptionProductPrice) =>
      UpdateSubscriptionProductPrice({
        subscriptionProductId,
        subscriptionProductPriceId,
        subscriptionProductPrice,
      })
  );
};

export default useUpdateSubscriptionProductPrice;
