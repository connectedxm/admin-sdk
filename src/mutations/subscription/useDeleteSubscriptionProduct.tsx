import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { SUBSCRIPTION_PRODUCTS_QUERY_KEY } from "@context/queries/subscriptions/useGetSubscriptionProducts";
import { SUBSCRIPTION_PRODUCT_QUERY_KEY } from "@context/queries/subscriptions/useGetSubscriptionProduct";

interface DeleteSubscriptionProductParams {
  subscriptionProductId: string;
}

export const DeleteSubscriptionProduct = async ({
  subscriptionProductId,
}: DeleteSubscriptionProductParams): Promise<ConnectedXMResponse<void>> => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.delete(
    `/subscription-products/${subscriptionProductId}`
  );

  return { ...data };
};

export const useDeleteSubscriptionProduct = (subscriptionProductId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useConnectedMutation(
    () => DeleteSubscriptionProduct({ subscriptionProductId }),
    {
      onSuccess: (
        _response: Awaited<ReturnType<typeof DeleteSubscriptionProduct>>
      ) => {
        router.replace("/subscriptions/products");
        queryClient.invalidateQueries(SUBSCRIPTION_PRODUCTS_QUERY_KEY());
        queryClient.removeQueries(
          SUBSCRIPTION_PRODUCT_QUERY_KEY(subscriptionProductId)
        );
      },
    }
  );
};

export default useDeleteSubscriptionProduct;
