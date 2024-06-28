import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { Tier } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { SUBSCRIPTION_PRODUCT_TIERS_QUERY_KEY } from "@context/queries/subscriptions/useGetSubscriptionProductTiers";

interface AddSubscriptionProductTierParams {
  subscriptionProductId: string;
  tierId: string;
}

export const AddSubscriptionProductTier = async ({
  subscriptionProductId,
  tierId,
}: AddSubscriptionProductTierParams): Promise<ConnectedXMResponse<Tier>> => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(
    `/subscription-products/${subscriptionProductId}/tiers/${tierId}`
  );

  return { ...data };
};

export const useAddSubscriptionProductTier = (
  subscriptionProductId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    (tierId: string) =>
      AddSubscriptionProductTier({
        subscriptionProductId,
        tierId,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(
          SUBSCRIPTION_PRODUCT_TIERS_QUERY_KEY(subscriptionProductId)
        );
      },
    }
  );
};

export default useAddSubscriptionProductTier;
