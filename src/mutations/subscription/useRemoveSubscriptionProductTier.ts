import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Tier } from "@src/interfaces";
import { SUBSCRIPTION_PRODUCT_TIERS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Subscriptions
 */
export interface RemoveSubscriptionProductTierParams extends MutationParams {
  subscriptionProductId: string;
  tierId: string;
}

/**
 * @category Methods
 * @group Subscriptions
 */
export const RemoveSubscriptionProductTier = async ({
  subscriptionProductId,
  tierId,
  adminApiParams,
  queryClient,
}: RemoveSubscriptionProductTierParams): Promise<ConnectedXMResponse<Tier>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete<ConnectedXMResponse<Tier>>(
    `/subscription-products/${subscriptionProductId}/tiers/${tierId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SUBSCRIPTION_PRODUCT_TIERS_QUERY_KEY(subscriptionProductId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Subscriptions
 */
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
