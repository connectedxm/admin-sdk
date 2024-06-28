import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { Subscription } from "@interfaces";

interface CreateSubscriptionParams {
  subscription: Subscription;
}

export const CreateSubscription = async ({
  subscription,
}: CreateSubscriptionParams): Promise<ConnectedXMResponse<Subscription>> => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(`/subscriptions`, subscription);

  return { ...data };
};

export const useCreateSubscription = () => {
  return useConnectedMutation<Subscription>((subscription) =>
    CreateSubscription({ subscription })
  );
};

export default useCreateSubscription;
