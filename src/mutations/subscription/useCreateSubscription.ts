import { GetAdminAPI } from "@src/AdminAPI";
import { Subscription, ConnectedXMResponse } from "@src/interfaces";
import {
  MutationParams,
  ConnectedXMMutationOptions,
  useConnectedMutation,
} from "../useConnectedMutation";
import { SubscriptionCreateInputs } from "@src/params";

/**
 * Endpoint to create a new subscription.
 * This function allows the creation of a new subscription by providing the necessary subscription details.
 * It is designed to be used in applications where subscription management is required.
 * @name CreateSubscription
 * @param {SubscriptionCreateInputs} subscription - The subscription details to be created
 * @version 1.2
 **/

export interface CreateSubscriptionParams extends MutationParams {
  subscription: SubscriptionCreateInputs;
}

export const CreateSubscription = async ({
  subscription,
  // queryClient,
  adminApiParams,
}: CreateSubscriptionParams): Promise<ConnectedXMResponse<Subscription>> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<ConnectedXMResponse<Subscription>>(
    `/subscriptions`,
    subscription
  );
  // if(queryClient && data.status === "ok") { }
  return data;
};

export const useCreateSubscription = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateSubscription>>,
      Omit<CreateSubscriptionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSubscriptionParams,
    Awaited<ReturnType<typeof CreateSubscription>>
  >(CreateSubscription, options, {
    domain: "subscriptions",
    type: "create",
  });
};