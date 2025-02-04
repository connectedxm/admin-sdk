import { GetAdminAPI } from "@src/AdminAPI";
import { Subscription, ConnectedXMResponse } from "@src/interfaces";
import {
  MutationParams,
  ConnectedXMMutationOptions,
  useConnectedMutation,
} from "../useConnectedMutation";
import { SubscriptionCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Subscriptions
 */
export interface CreateSubscriptionParams extends MutationParams {
  subscription: SubscriptionCreateInputs;
}

/**
 * @category Methods
 * @group Subscriptions
 */
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

/**
 * @category Mutations
 * @group Subscriptions
 */
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
