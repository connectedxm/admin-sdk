import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { Subscription, ConnectedXMResponse } from "@src/interfaces";
import { SubscriptionUpdateInputs } from "@src/params";

/**
 * Endpoint to update a subscription with new details.
 * This function allows users to modify an existing subscription by providing the subscription ID and the updated subscription details.
 * It is designed to be used in applications where subscription management is required.
 * @name UpdateSubscription
 * @param {string} subscriptionId (path) - The id of the subscription
 * @param {SubscriptionUpdateInputs} subscription (body) - The subscription update inputs
 * @version 1.3
 **/

export interface UpdateSubscriptionParams extends MutationParams {
  subscriptionId: string;
  subscription: SubscriptionUpdateInputs;
}

export const UpdateSubscription = async ({
  subscriptionId,
  subscription,
  adminApiParams,
}: UpdateSubscriptionParams): Promise<ConnectedXMResponse<Subscription>> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put<ConnectedXMResponse<Subscription>>(
    `/subscriptions/${subscriptionId}`,
    subscription
  );
  return data;
};

export const useUpdateSubscription = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSubscription>>,
      Omit<UpdateSubscriptionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSubscriptionParams,
    Awaited<ReturnType<typeof UpdateSubscription>>
  >(UpdateSubscription, options, {
    domain: "subscriptions",
    type: "update",
  });
};