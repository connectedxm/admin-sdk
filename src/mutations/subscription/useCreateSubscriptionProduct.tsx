import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { Subscription, SubscriptionProduct } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { SUBSCRIPTION_PRODUCTS_QUERY_KEY } from "@context/queries/subscriptions/useGetSubscriptionProducts";
import { SET_SUBSCRIPTION_PRODUCT_QUERY_DATA } from "@context/queries/subscriptions/useGetSubscriptionProduct";

interface CreateSubscriptionProductParams {
  subscriptionProduct: SubscriptionProduct;
}

export const CreateSubscriptionProduct = async ({
  subscriptionProduct,
}: CreateSubscriptionProductParams): Promise<
  ConnectedXMResponse<SubscriptionProduct>
> => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(
    `/subscription-products`,
    subscriptionProduct
  );

  return { ...data };
};

export const useCreateSubscriptionProduct = () => {
  const queryClient = useQueryClient();

  return useConnectedMutation<SubscriptionProduct>(
    (subscriptionProduct) => CreateSubscriptionProduct({ subscriptionProduct }),
    {
      onSuccess: (
        subscriptionProduct: Awaited<
          ReturnType<typeof CreateSubscriptionProduct>
        >
      ) => {
        queryClient.invalidateQueries(SUBSCRIPTION_PRODUCTS_QUERY_KEY());
        SET_SUBSCRIPTION_PRODUCT_QUERY_DATA(
          queryClient,
          [subscriptionProduct?.data?.id],
          subscriptionProduct
        );
      },
    }
  );
};

export default useCreateSubscriptionProduct;
