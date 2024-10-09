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
 * @category Params
 * @group Subscriptions
 */
export interface DeleteSubscriptionProductPriceParams extends MutationParams {
  subscriptionProductId: string;
}

/**
 * @category Methods
 * @group Subscriptions
 */
export const DeleteSubscriptionProductPrice = async ({
  subscriptionProductId,
  adminApiParams,
  queryClient,
}: DeleteSubscriptionProductPriceParams): Promise<
  ConnectedXMResponse<void>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete<ConnectedXMResponse<void>>(
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

/**
 * @category Mutations
 * @group Subscriptions
 */
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
