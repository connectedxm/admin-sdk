import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { SubscriptionProductPrice, ConnectedXMResponse } from "@src/interfaces";
import {
  SUBSCRIPTION_PRODUCT_PRICES_QUERY_KEY,
  SET_SUBSCRIPTION_PRODUCT_PRICE_QUERY_DATA,
} from "@src/queries";
import { SubscriptionProductPriceCreateInputs } from "@src/params";

/**
 * Endpoint to create a new price for a subscription product.
 * This function allows the creation of a subscription product price by providing the necessary inputs.
 * It is designed to be used in applications where subscription pricing needs to be managed.
 * @name CreateSubscriptionProductPrice
 * @param {string} subscriptionProductId (path) The id of the subscription product
 * @param {SubscriptionProductPriceCreateInputs} subscriptionProductPrice (body) The inputs for creating a subscription product price
 * @version 1.3
 **/

export interface CreateSubscriptionProductPriceParams extends MutationParams {
  subscriptionProductId: string;
  subscriptionProductPrice: SubscriptionProductPriceCreateInputs;
}

export const CreateSubscriptionProductPrice = async ({
  subscriptionProductId,
  subscriptionProductPrice,
  adminApiParams,
  queryClient,
}: CreateSubscriptionProductPriceParams): Promise<
  ConnectedXMResponse<SubscriptionProductPrice>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<
    ConnectedXMResponse<SubscriptionProductPrice>
  >(
    `/subscription-products/${subscriptionProductId}/prices`,
    subscriptionProductPrice
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SUBSCRIPTION_PRODUCT_PRICES_QUERY_KEY(subscriptionProductId),
    });
    SET_SUBSCRIPTION_PRODUCT_PRICE_QUERY_DATA(
      queryClient,
      [subscriptionProductId, data?.data?.id],
      data
    );
  }
  return data;
};

export const useCreateSubscriptionProductPrice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateSubscriptionProductPrice>>,
      Omit<
        CreateSubscriptionProductPriceParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSubscriptionProductPriceParams,
    Awaited<ReturnType<typeof CreateSubscriptionProductPrice>>
  >(CreateSubscriptionProductPrice, options, {
    domain: "subscriptions",
    type: "create",
  });
};
