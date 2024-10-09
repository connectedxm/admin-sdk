import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Subscription, SubscriptionStatus } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Subscriptions
 */
export const SUBSCRIPTIONS_QUERY_KEY = () => ["SUBSCRIPTIONS"];

/**
 * @category Setters
 * @group Subscriptions
 */
export const SET_SUBSCRIPTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SUBSCRIPTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSubscriptions>>
) => {
  client.setQueryData(SUBSCRIPTIONS_QUERY_KEY(...keyParams), response);
};

interface GetSubscriptionsProps extends InfiniteQueryParams {
  status?: SubscriptionStatus;
  subscriptionProductId?: string;
}

/**
 * @category Queries
 * @group Subscriptions
 */
export const GetSubscriptions = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  status,
  subscriptionProductId,
  adminApiParams,
}: GetSubscriptionsProps): Promise<ConnectedXMResponse<Subscription[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/subscriptions`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      status: status || undefined,
      subscriptionProductId: subscriptionProductId || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Subscriptions
 */
export const useGetSubscriptions = (
  status?: SubscriptionStatus,
  subscriptionProductId?: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSubscriptions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSubscriptions>>
  >(
    SUBSCRIPTIONS_QUERY_KEY(),
    (params: InfiniteQueryParams) =>
      GetSubscriptions({
        status,
        subscriptionProductId,
        ...params,
      }),
    params,
    options,
    "subscriptions"
  );
};
