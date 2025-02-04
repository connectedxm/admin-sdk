import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  SUBSCRIPTION_PRODUCTS_QUERY_KEY,
  SUBSCRIPTION_PRODUCT_QUERY_KEY,
} from "@src/queries";

/**
 * Endpoint to delete a subscription product price.
 * This function allows the removal of a specific subscription product price by its unique identifier.
 * It is intended for use in applications that manage subscription products and require the ability to delete product prices.
 * @name DeleteSubscriptionProductPrice
 * @param {string} subscriptionProductId - The id of the subscription product
 * @version 1.2
 **/

export interface DeleteSubscriptionProductPriceParams extends MutationParams {
  subscriptionProductId: string;
}

export const DeleteSubscriptionProductPrice = async ({
  subscriptionProductId,
  adminApiParams,
  queryClient,
}: DeleteSubscriptionProductPriceParams): Promise<
  ConnectedXMResponse<void>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete<ConnectedXMResponse<void>>(
    `/subscription-products/${subscriptionProductId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SUBSCRIPTION_PRODUCTS_QUERY_KEY(),
    });
    queryClient.removeQueries({
      queryKey: SUBSCRIPTION_PRODUCT_QUERY_KEY(subscriptionProductId),
    });
  }

  return data;
};

export const useDeleteSubscriptionProductPrice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteSubscriptionProductPrice>>,
      Omit<
        DeleteSubscriptionProductPriceParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSubscriptionProductPriceParams,
    Awaited<ReturnType<typeof DeleteSubscriptionProductPrice>>
  >(DeleteSubscriptionProductPrice, options, {
    domain: "subscriptions",
    type: "del",
  });
};