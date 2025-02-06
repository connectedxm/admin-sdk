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
 * Endpoint to delete a subscription product.
 * This function allows the deletion of a specific subscription product by its ID.
 * It is used in scenarios where a subscription product needs to be removed from the system.
 * @name DeleteSubscriptionProduct
 * @param {string} subscriptionProductId (path) - The ID of the subscription product to delete
 * @version 1.3
 **/

export interface DeleteSubscriptionProductParams extends MutationParams {
  subscriptionProductId: string;
}

export const DeleteSubscriptionProduct = async ({
  subscriptionProductId,
  adminApiParams,
  queryClient,
}: DeleteSubscriptionProductParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
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

export const useDeleteSubscriptionProduct = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteSubscriptionProduct>>,
      Omit<DeleteSubscriptionProductParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSubscriptionProductParams,
    Awaited<ReturnType<typeof DeleteSubscriptionProduct>>
  >(DeleteSubscriptionProduct, options, {
    domain: "subscriptions",
    type: "del",
  });
};