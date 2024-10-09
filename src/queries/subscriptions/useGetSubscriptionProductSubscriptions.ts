import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Subscription, SubscriptionStatus } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { SUBSCRIPTION_PRODUCT_QUERY_KEY } from "./useGetSubscriptionProduct";

/**
 * @category Keys
 * @group Subscriptions
 */
export const SUBSCRIPTION_PRODUCT_SUBSCRIPTIONS_QUERY_KEY = (
  subscriptionProductId: string,
  status?: SubscriptionStatus
) => {
  const queryKey = [
    ...SUBSCRIPTION_PRODUCT_QUERY_KEY(subscriptionProductId),
    subscriptionProductId,
  ];

  if (status) {
    queryKey.push(status);
  }

  return queryKey;
};

/**
 * @category Setters
 * @group Subscriptions
 */
export const SET_SUBSCRIPTION_PRODUCT_SUBSCRIPTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SUBSCRIPTION_PRODUCT_SUBSCRIPTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSubscriptionProductSubscriptions>>
) => {
  client.setQueryData(
    SUBSCRIPTION_PRODUCT_SUBSCRIPTIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetSubscriptionProductSubscriptionsProps extends InfiniteQueryParams {
  subscriptionProductId: string;
  status?: SubscriptionStatus;
}

/**
 * @category Queries
 * @group Subscriptions
 */
export const GetSubscriptionProductSubscriptions = async ({
  subscriptionProductId,
  status,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSubscriptionProductSubscriptionsProps): Promise<
  ConnectedXMResponse<Subscription[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/subscription-products/${subscriptionProductId}/subscriptions`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
        status: status || undefined,
      },
    }
  );
  return data;
};
/**
 * @category Hooks
 * @group Subscriptions
 */
export const useGetSubscriptionProductSubscriptions = (
  subscriptionProductId: string,
  status?: SubscriptionStatus,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSubscriptionProductSubscriptions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSubscriptionProductSubscriptions>>
  >(
    SUBSCRIPTION_PRODUCT_SUBSCRIPTIONS_QUERY_KEY(subscriptionProductId),
    (params: InfiniteQueryParams) =>
      GetSubscriptionProductSubscriptions({
        subscriptionProductId,
        status,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!subscriptionProductId && (options.enabled ?? true),
    },
    "subscriptions"
  );
};
