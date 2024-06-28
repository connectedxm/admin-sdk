import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { Subscription } from "@interfaces";

interface UpdateSubscriptionParams {
  subscriptionId: string;
  subscription: Subscription;
}

export const UpdateSubscription = async ({
  subscriptionId,
  subscription,
}: UpdateSubscriptionParams): Promise<ConnectedXMResponse<Subscription>> => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.put(
    `/subscriptions/${subscriptionId}`,
    subscription
  );

  return { ...data };
};

export const useUpdateSubscription = (subscriptionId: string) => {
  return useConnectedMutation<Subscription>((subscription) =>
    UpdateSubscription({ subscriptionId, subscription })
  );
};

export default useUpdateSubscription;
