import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Payment } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { SUBSCRIPTION_QUERY_KEY } from "./useGetSubscription";

/**
 * Endpoint to retrieve a list of payments associated with a specific subscription.
 * This function allows users to fetch detailed information about all payments made under a given subscription.
 * It is designed to be used in applications where tracking and managing subscription payments is required.
 * @name GetSubscriptionPayments
 * @param {string} subscriptionId - The id of the subscription
 * @version 1.2
 **/

export const SUBSCRIPTION_PAYMENTS_QUERY_KEY = (subscriptionId: string) => [
  ...SUBSCRIPTION_QUERY_KEY(subscriptionId),
  "PAYMENTS",
];

export const SET_SUBSCRIPTION_PAYMENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SUBSCRIPTION_PAYMENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSubscriptionPayments>>
) => {
  client.setQueryData(SUBSCRIPTION_PAYMENTS_QUERY_KEY(...keyParams), response);
};

interface GetSubscriptionPaymentsProps extends InfiniteQueryParams {
  subscriptionId: string;
}

export const GetSubscriptionPayments = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  subscriptionId,
  adminApiParams,
}: GetSubscriptionPaymentsProps): Promise<ConnectedXMResponse<Payment[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/subscriptions/${subscriptionId}/payments`,
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

export const useGetSubscriptionPayments = (
  subscriptionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSubscriptionPayments>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSubscriptionPayments>>
  >(
    SUBSCRIPTION_PAYMENTS_QUERY_KEY(subscriptionId),
    (params: InfiniteQueryParams) =>
      GetSubscriptionPayments({ ...params, subscriptionId }),
    params,
    {
      ...options,
      enabled: !!subscriptionId && (options.enabled ?? true),
    },
    "subscriptions"
  );
};