import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { Subscription, ConnectedXMResponse } from "@src/interfaces";
import { SubscriptionUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Subscriptions
 */
export interface UpdateSubscriptionParams extends MutationParams {
  subscriptionId: string;
  subscription: SubscriptionUpdateInputs;
}

/**
 * @category Methods
 * @group Subscriptions
 */
export const UpdateSubscription = async ({
  subscriptionId,
  subscription,
  // queryClient,
  adminApiParams,
}: UpdateSubscriptionParams): Promise<ConnectedXMResponse<Subscription>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<ConnectedXMResponse<Subscription>>(
    `/subscriptions/${subscriptionId}`,
    subscription
  );
  // if(queryClient && data.status === "ok") { }
  return data;
};

/**
 * @category Mutations
 * @group Subscriptions
 */
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
  >(UpdateSubscription, options);
};
