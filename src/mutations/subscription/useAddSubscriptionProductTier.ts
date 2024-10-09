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
export interface AddSubscriptionProductTierParams extends MutationParams {
  subscriptionProductId: string;
  tierId: string;
}

/**
 * @category Methods
 * @group Subscriptions
 */
export const AddSubscriptionProductTier = async ({
  subscriptionProductId,
  tierId,
  adminApiParams,
  queryClient,
}: AddSubscriptionProductTierParams): Promise<ConnectedXMResponse<Tier>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<ConnectedXMResponse<Tier>>(
    `/subscription-products/${subscriptionProductId}/tiers/${tierId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SUBSCRIPTION_PRODUCT_TIERS_QUERY_KEY(subscriptionProductId),
    });
  }
  return { ...data };
};

/**
 * @category Mutations
 * @group Subscriptions
 */
export const useAddSubscriptionProductTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddSubscriptionProductTier>>,
      Omit<AddSubscriptionProductTierParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddSubscriptionProductTierParams,
    Awaited<ReturnType<typeof AddSubscriptionProductTier>>
  >(AddSubscriptionProductTier, options, {
    domain: "subscriptions",
    type: "update",
  });
};
