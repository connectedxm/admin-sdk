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
 * Endpoint to cancel a subscription.
 * This function allows users to cancel an existing subscription by providing the subscription ID.
 * It ensures that the subscription is removed and updates the query data accordingly.
 * @name CancelSubscription
 * @param {string} subscriptionId - The ID of the subscription to be canceled
 * @version 1.2
 **/

export interface CancelSubscriptionParams extends MutationParams {
  subscriptionId: string;
}

export const CancelSubscription = async ({
  subscriptionId,
  adminApiParams,
  queryClient,
}: CancelSubscriptionParams): Promise<ConnectedXMResponse<Subscription>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<Subscription>>(
    `/subscriptions/${subscriptionId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_QUERY_KEY() });
    SET_SUBSCRIPTION_QUERY_DATA(queryClient, [subscriptionId], data);
  }
  return data;
};

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