import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { SUBSCRIPTIONS_QUERY_KEY, SUBSCRIPTION_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Subscriptions
 */
export interface CancelSubscriptionParams extends MutationParams {
  subscriptionId: string;
}

/**
 * @category Methods
 * @group Subscriptions
 */
export const CancelSubscription = async ({
  subscriptionId,
  adminApiParams,
  queryClient,
}: CancelSubscriptionParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/subscriptions/${subscriptionId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_QUERY_KEY() });
    queryClient.invalidateQueries({
      queryKey: SUBSCRIPTION_QUERY_KEY(subscriptionId.toString()),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Subscriptions
 */
export const useCancelSubscription = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CancelSubscription>>,
      Omit<CancelSubscriptionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CancelSubscriptionParams,
    Awaited<ReturnType<typeof CancelSubscription>>
  >(CancelSubscription, options);
};
