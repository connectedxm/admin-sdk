import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { SubscriptionProductPrice, ConnectedXMResponse } from "@src/interfaces";
import { SubscriptionProductPriceUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Subscriptions
 */
export interface UpdateSubscriptionProductPriceParams extends MutationParams {
  subscriptionProductId: string;
  subscriptionProductPriceId: string;
  subscriptionProductPrice: SubscriptionProductPriceUpdateInputs;
}

/**
 * @category Methods
 * @group Subscriptions
 */
export const UpdateSubscriptionProductPrice = async ({
  subscriptionProductId,
  subscriptionProductPriceId,
  subscriptionProductPrice,
  // queryClient,
  adminApiParams,
}: UpdateSubscriptionProductPriceParams): Promise<
  ConnectedXMResponse<SubscriptionProductPrice>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<SubscriptionProductPrice>
  >(
    `/subscription-products/${subscriptionProductId}/prices/${subscriptionProductPriceId}`,
    subscriptionProductPrice
  );
  // if(queryClient && data.status === "ok") { }
  return data;
};

/**
 * @category Mutations
 * @group Subscriptions
 */
export const useUpdateSubscriptionProductPrice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSubscriptionProductPrice>>,
      Omit<
        UpdateSubscriptionProductPriceParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSubscriptionProductPriceParams,
    Awaited<ReturnType<typeof UpdateSubscriptionProductPrice>>
  >(UpdateSubscriptionProductPrice, options);
};
