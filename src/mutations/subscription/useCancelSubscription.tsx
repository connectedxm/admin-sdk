import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { SUBSCRIPTIONS_QUERY_KEY } from "@context/queries/subscriptions/useGetSubscriptions";
import { SUBSCRIPTION_QUERY_KEY } from "@context/queries/subscriptions/useGetSubscription";

interface CancelSubscriptionParams {
  subscriptionId: string;
}

export const CancelSubscription = async ({
  subscriptionId,
}: CancelSubscriptionParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(`/subscriptions/${subscriptionId}`);
  return data;
};

export const useCancelSubscription = (subscriptionId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(() => CancelSubscription({ subscriptionId }), {
    onSuccess: async (
      _response: Awaited<ReturnType<typeof CancelSubscription>>
    ) => {
      queryClient.invalidateQueries(SUBSCRIPTIONS_QUERY_KEY());
      queryClient.invalidateQueries(
        SUBSCRIPTION_QUERY_KEY(subscriptionId.toString())
      );
    },
  });
};

export default useCancelSubscription;
