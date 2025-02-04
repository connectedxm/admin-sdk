import { GetAdminAPI } from "@src/AdminAPI";
import { SubscriptionProduct, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import {
  SUBSCRIPTION_PRODUCTS_QUERY_KEY,
  SET_SUBSCRIPTION_PRODUCT_QUERY_DATA,
} from "@src/queries";
import { SubscriptionProductCreateInputs } from "@src/params";

/**
 * Endpoint to create a new subscription product.
 * This function allows the creation of a subscription product by providing the necessary details.
 * It is designed to be used in applications where subscription products need to be managed.
 * @name CreateSubscriptionProduct
 * @param {SubscriptionProductCreateInputs} subscriptionProduct - The subscription product details to be created
 * @version 1.2
 **/
export interface CreateSubscriptionProductParams extends MutationParams {
  subscriptionProduct: SubscriptionProductCreateInputs;
}

export const CreateSubscriptionProduct = async ({
  subscriptionProduct,
  adminApiParams,
  queryClient,
}: CreateSubscriptionProductParams): Promise<
  ConnectedXMResponse<SubscriptionProduct>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<
    ConnectedXMResponse<SubscriptionProduct>
  >(`/subscription-products`, subscriptionProduct);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SUBSCRIPTION_PRODUCTS_QUERY_KEY(),
    });
    SET_SUBSCRIPTION_PRODUCT_QUERY_DATA(queryClient, [data?.data?.id], data);
  }
  return data;
};

export const useCreateSubscriptionProduct = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateSubscriptionProduct>>,
      Omit<CreateSubscriptionProductParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSubscriptionProductParams,
    Awaited<ReturnType<typeof CreateSubscriptionProduct>>
  >(CreateSubscriptionProduct, options, {
    domain: "subscriptions",
    type: "create",
  });
};