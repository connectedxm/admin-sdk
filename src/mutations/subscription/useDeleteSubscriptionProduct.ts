import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  SUBSCRIPTION_PRODUCTS_QUERY_KEY,
  SUBSCRIPTION_PRODUCT_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Subscriptions
 */
export interface DeleteSubscriptionProductParams extends MutationParams {
  subscriptionProductId: string;
}

/**
 * @category Methods
 * @group Subscriptions
 */
export const DeleteSubscriptionProduct = async ({
  subscriptionProductId,
  adminApiParams,
  queryClient,
}: DeleteSubscriptionProductParams): Promise<ConnectedXMResponse<void>> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.delete<ConnectedXMResponse<void>>(
    `/subscription-products/${subscriptionProductId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SUBSCRIPTION_PRODUCTS_QUERY_KEY(),
    });
    queryClient.removeQueries({
      queryKey: SUBSCRIPTION_PRODUCT_QUERY_KEY(subscriptionProductId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Subscriptions
 */
export const useDeleteSubscriptionProduct = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteSubscriptionProduct>>,
      Omit<DeleteSubscriptionProductParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSubscriptionProductParams,
    Awaited<ReturnType<typeof DeleteSubscriptionProduct>>
  >(DeleteSubscriptionProduct, options, {
    domain: "subscriptions",
    type: "del",
  });
};
