import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { SubscriptionProduct } from "@interfaces";

interface UpdateSubscriptionProductParams {
  subscriptionProductId: string;
  subscriptionProduct: SubscriptionProduct;
}

export const UpdateSubscriptionProduct = async ({
  subscriptionProductId,
  subscriptionProduct,
}: UpdateSubscriptionProductParams): Promise<
  ConnectedXMResponse<SubscriptionProduct>
> => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.put(
    `/subscription-products/${subscriptionProductId}`,
    subscriptionProduct
  );

  return { ...data };
};

export const useUpdateSubscriptionProduct = (subscriptionProductId: string) => {
  return useConnectedMutation<SubscriptionProduct>((subscriptionProduct) =>
    UpdateSubscriptionProduct({ subscriptionProductId, subscriptionProduct })
  );
};

export default useUpdateSubscriptionProduct;
