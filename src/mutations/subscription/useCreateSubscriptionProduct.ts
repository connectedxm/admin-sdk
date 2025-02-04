import { GetAdminAPI } from "@src/AdminAPI";
import { SubscriptionProduct, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import {
  SUBSCRIPTION_PRODUCTS_QUERY_KEY,
  SET_SUBSCRIPTION_PRODUCT_QUERY_DATA,
} from "@src/queries";
import { SubscriptionProductCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Subscriptions
 */
export interface CreateSubscriptionProductParams extends MutationParams {
  subscriptionProduct: SubscriptionProductCreateInputs;
}

/**
 * @category Methods
 * @group Subscriptions
 */
export const CreateSubscriptionProduct = async ({
  subscriptionProduct,
  adminApiParams,
  queryClient,
}: CreateSubscriptionProductParams): Promise<
  ConnectedXMResponse<SubscriptionProduct>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<
    ConnectedXMResponse<SubscriptionProduct>
  >(`/subscription-products`, subscriptionProduct);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SUBSCRIPTION_PRODUCTS_QUERY_KEY(),
    });
    SET_SUBSCRIPTION_PRODUCT_QUERY_DATA(queryClient, [data?.data?.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Subscriptions
 */
export const useCreateSubscriptionProduct = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateSubscriptionProduct>>,
      Omit<CreateSubscriptionProductParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSubscriptionProductParams,
    Awaited<ReturnType<typeof CreateSubscriptionProduct>>
  >(CreateSubscriptionProduct, options, {
    domain: "subscriptions",
    type: "create",
  });
};
