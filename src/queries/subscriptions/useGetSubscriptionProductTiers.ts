import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Tier } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { SUBSCRIPTION_PRODUCT_QUERY_KEY } from "./useGetSubscriptionProduct";

/**
 * Retrieves the tiers associated with a specific subscription product.
 * This function is used to fetch and manage the tier data for a given subscription product, 
 * allowing applications to display or process tier information as needed.
 * @name GetSubscriptionProductTiers
 * @param {string} subscriptionProductId - The id of the subscription product
 * @version 1.2
 **/
export const SUBSCRIPTION_PRODUCT_TIERS_QUERY_KEY = (
  subscriptionProductId: string
) => [
  ...SUBSCRIPTION_PRODUCT_QUERY_KEY(subscriptionProductId),
  "SUBSCRIPTION_PRODUCT_TIERS",
];

export const SET_SUBSCRIPTION_PRODUCT_TIERS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SUBSCRIPTION_PRODUCT_TIERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSubscriptionProductTiers>>
) => {
  client.setQueryData(
    SUBSCRIPTION_PRODUCT_TIERS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetSubscriptionProductTiersProps extends InfiniteQueryParams {
  subscriptionProductId: string;
}

export const GetSubscriptionProductTiers = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  subscriptionProductId,
  adminApiParams,
}: GetSubscriptionProductTiersProps): Promise<ConnectedXMResponse<Tier[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/subscription-products/${subscriptionProductId}/tiers`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};

export const useGetSubscriptionProductTiers = (
  subscriptionProductId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSubscriptionProductTiers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSubscriptionProductTiers>>
  >(
    SUBSCRIPTION_PRODUCT_TIERS_QUERY_KEY(subscriptionProductId),
    (params: InfiniteQueryParams) =>
      GetSubscriptionProductTiers({ ...params, subscriptionProductId }),
    params,
    {
      ...options,
      enabled: !!subscriptionProductId && (options.enabled ?? true),
    },
    "subscriptions"
  );
};