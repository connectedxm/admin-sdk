import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Tier } from "@src/interfaces";
import { SUBSCRIPTION_PRODUCT_TIERS_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to remove a tier from a subscription product.
 * This function allows the removal of a specific tier from a subscription product by providing the subscription product ID and the tier ID.
 * It is used in scenarios where a tier needs to be deleted from a subscription product, ensuring the subscription product is updated accordingly.
 * @name RemoveSubscriptionProductTier
 * @param {string} subscriptionProductId - The id of the subscription product
 * @param {string} tierId - The id of the tier to be removed
 * @version 1.2
 **/

export interface RemoveSubscriptionProductTierParams extends MutationParams {
  subscriptionProductId: string;
  tierId: string;
}

export const RemoveSubscriptionProductTier = async ({
  subscriptionProductId,
  tierId,
  adminApiParams,
  queryClient,
}: RemoveSubscriptionProductTierParams): Promise<ConnectedXMResponse<Tier>> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete<ConnectedXMResponse<Tier>>(
    `/subscription-products/${subscriptionProductId}/tiers/${tierId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SUBSCRIPTION_PRODUCT_TIERS_QUERY_KEY(subscriptionProductId),
    });
  }
  return data;
};

export const useRemoveSubscriptionProductTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveSubscriptionProductTier>>,
      Omit<
        RemoveSubscriptionProductTierParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveSubscriptionProductTierParams,
    Awaited<ReturnType<typeof RemoveSubscriptionProductTier>>
  >(RemoveSubscriptionProductTier, options, {
    domain: "subscriptions",
    type: "update",
  });
};