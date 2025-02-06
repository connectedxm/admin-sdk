import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { SubscriptionProduct, ConnectedXMResponse } from "@src/interfaces";
import { SubscriptionProductUpdateInputs } from "@src/params";
import {
  SUBSCRIPTION_PRODUCTS_QUERY_KEY,
  SUBSCRIPTION_PRODUCT_QUERY_KEY,
} from "@src/queries";

/**
 * Endpoint to update the details of a specific subscription product.
 * This function allows for updating the information of a subscription product by providing its ID and the new details.
 * It is intended for use in applications that manage subscription products and require the ability to modify product details.
 * @name UpdateSubscriptionProduct
 * @param {string} subscriptionProductId (path) - The ID of the subscription product
 * @param {SubscriptionProductUpdateInputs} subscriptionProduct (body) - The new details of the subscription product
 * @version 1.3
 **/

export interface UpdateSubscriptionProductParams extends MutationParams {
  subscriptionProductId: string;
  subscriptionProduct: SubscriptionProductUpdateInputs;
}

export const UpdateSubscriptionProduct = async ({
  subscriptionProductId,
  subscriptionProduct,
  queryClient,
  adminApiParams,
}: UpdateSubscriptionProductParams): Promise<
  ConnectedXMResponse<SubscriptionProduct>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put<ConnectedXMResponse<SubscriptionProduct>>(
    `/subscription-products/${subscriptionProductId}`,
    subscriptionProduct
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SUBSCRIPTION_PRODUCTS_QUERY_KEY(),
    });
    queryClient.invalidateQueries({
      queryKey: SUBSCRIPTION_PRODUCT_QUERY_KEY(subscriptionProductId),
    });
  }
  return data;
};

export const useUpdateSubscriptionProduct = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSubscriptionProduct>>,
      Omit<UpdateSubscriptionProductParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSubscriptionProductParams,
    Awaited<ReturnType<typeof UpdateSubscriptionProduct>>
  >(UpdateSubscriptionProduct, options, {
    domain: "subscriptions",
    type: "update",
  });
};