import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Subscription } from "@src/interfaces";
import {
  SET_SUBSCRIPTION_QUERY_DATA,
  SUBSCRIPTIONS_QUERY_KEY,
} from "@src/queries";

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
}: CancelSubscriptionParams): Promise<ConnectedXMResponse<Subscription>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<Subscription>>(
    `/subscriptions/${subscriptionId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_QUERY_KEY() });
    SET_SUBSCRIPTION_QUERY_DATA(queryClient, [subscriptionId], data);
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
  >(CancelSubscription, options, {
    domain: "subscriptions",
    type: "update",
  });
};
