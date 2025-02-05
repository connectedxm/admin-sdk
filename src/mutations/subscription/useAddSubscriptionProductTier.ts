import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Tier } from "@src/interfaces";
import { SUBSCRIPTION_PRODUCT_TIERS_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to add a tier to a subscription product.
 * This function allows the addition of a specific tier to a given subscription product by their respective IDs.
 * It is used in scenarios where subscription products need to be enhanced with additional tiers.
 * @name AddSubscriptionProductTier
 * @param {string} subscriptionProductId - The id of the subscription product
 * @param {string} tierId - The id of the tier
 * @version 1.2
 **/

export interface AddSubscriptionProductTierParams extends MutationParams {
  subscriptionProductId: string;
  tierId: string;
}

export const AddSubscriptionProductTier = async ({
  subscriptionProductId,
  tierId,
  adminApiParams,
  queryClient,
}: AddSubscriptionProductTierParams): Promise<ConnectedXMResponse<Tier>> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<ConnectedXMResponse<Tier>>(
    `/subscription-products/${subscriptionProductId}/tiers/${tierId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SUBSCRIPTION_PRODUCT_TIERS_QUERY_KEY(subscriptionProductId),
    });
  }
  return { ...data };
};

export const useAddSubscriptionProductTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddSubscriptionProductTier>>,
      Omit<AddSubscriptionProductTierParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation(AddSubscriptionProductTier, options);
};