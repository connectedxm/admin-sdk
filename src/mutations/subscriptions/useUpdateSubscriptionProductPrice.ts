import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { SubscriptionProductPrice, ConnectedXMResponse } from "@src/interfaces";
import { SubscriptionProductPriceUpdateInputs } from "@src/params";
import {
  SET_SUBSCRIPTION_PRODUCT_PRICE_QUERY_DATA,
  SUBSCRIPTION_PRODUCT_PRICES_QUERY_KEY,
} from "@src/queries";

/**
 * Endpoint to update the price of a subscription product.
 * This function allows updating the price details of a specific subscription product by providing the necessary identifiers and update inputs.
 * It is designed to be used in applications where subscription product pricing needs to be modified.
 * @name UpdateSubscriptionProductPrice
 * @param {string} subscriptionProductId (path) The id of the subscription product
 * @param {string} subscriptionProductPriceId (path) The id of the subscription product price
 * @param {SubscriptionProductPriceUpdateInputs} subscriptionProductPrice (body) The subscription product price update inputs
 * @version 1.3
 **/

export interface UpdateSubscriptionProductPriceParams extends MutationParams {
  subscriptionProductId: string;
  subscriptionProductPriceId: string;
  subscriptionProductPrice: SubscriptionProductPriceUpdateInputs;
}

export const UpdateSubscriptionProductPrice = async ({
  subscriptionProductId,
  subscriptionProductPriceId,
  subscriptionProductPrice,
  queryClient,
  adminApiParams,
}: UpdateSubscriptionProductPriceParams): Promise<
  ConnectedXMResponse<SubscriptionProductPrice>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<
    ConnectedXMResponse<SubscriptionProductPrice>
  >(
    `/subscription-products/${subscriptionProductId}/prices/${subscriptionProductPriceId}`,
    subscriptionProductPrice
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SUBSCRIPTION_PRODUCT_PRICES_QUERY_KEY(subscriptionProductId),
    });
    SET_SUBSCRIPTION_PRODUCT_PRICE_QUERY_DATA(
      queryClient,
      [subscriptionProductId, subscriptionProductPriceId],
      data
    );
  }
  return data;
};

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
  >(UpdateSubscriptionProductPrice, options, {
    domain: "subscriptions",
    type: "update",
  });
};
