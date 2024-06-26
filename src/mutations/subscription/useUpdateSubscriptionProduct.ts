import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { SubscriptionProduct, ConnectedXMResponse } from "@src/interfaces";

/**
 * @category Params
 * @group Subscriptions
 */
export interface UpdateSubscriptionProductParams extends MutationParams {
  subscriptionProductId: string;
  subscriptionProduct: SubscriptionProduct;
}

/**
 * @category Methods
 * @group Subscriptions
 */
export const UpdateSubscriptionProduct = async ({
  subscriptionProductId,
  subscriptionProduct,
  // queryClient,
  adminApiParams,
}: UpdateSubscriptionProductParams): Promise<
  ConnectedXMResponse<SubscriptionProduct>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<
    ConnectedXMResponse<SubscriptionProduct>
  >(`/subscription-products/${subscriptionProductId}`, subscriptionProduct);
  // if(queryClient && data.status === "ok") { }
  return data;
};

/**
 * @category Mutations
 * @group Subscriptions
 */
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
  >(UpdateSubscriptionProduct, options);
};
