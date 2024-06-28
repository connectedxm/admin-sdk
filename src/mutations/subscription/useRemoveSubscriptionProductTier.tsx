import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { Tier } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { SUBSCRIPTION_PRODUCT_TIERS_QUERY_KEY } from "@context/queries/subscriptions/useGetSubscriptionProductTiers";

interface RemoveSubscriptionProductTierParams {
  subscriptionProductId: string;
  tierId: string;
}

export const RemoveSubscriptionProductTier = async ({
  subscriptionProductId,
  tierId,
}: RemoveSubscriptionProductTierParams): Promise<ConnectedXMResponse<Tier>> => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.delete(
    `/subscription-products/${subscriptionProductId}/tiers/${tierId}`
  );

  return { ...data };
};

export const useRemoveSubscriptionProductTier = (
  subscriptionProductId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    (tierId: string) =>
      RemoveSubscriptionProductTier({
        subscriptionProductId,
        tierId,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(
          SUBSCRIPTION_PRODUCT_TIERS_QUERY_KEY(subscriptionProductId)
        );
      },
    },
    undefined,
    true
  );
};

export default useRemoveSubscriptionProductTier;
