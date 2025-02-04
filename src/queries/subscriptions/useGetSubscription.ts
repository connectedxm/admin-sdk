import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Subscription } from "@src/interfaces";
import { SUBSCRIPTIONS_QUERY_KEY } from "./useGetSubscriptions";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Fetches subscription details by its unique ID.
 * This function is designed to retrieve detailed information about a specific subscription using its ID.
 * It is intended for use in applications where subscription data is required for display or processing.
 * @name GetSubscription
 * @param {string} subscriptionId - The ID of the subscription
 * @version 1.2
 **/

export const SUBSCRIPTION_QUERY_KEY = (subscriptionId: string) => [
  ...SUBSCRIPTIONS_QUERY_KEY(),
  subscriptionId,
];

export const SET_SUBSCRIPTION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SUBSCRIPTION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSubscription>>
) => {
  client.setQueryData(SUBSCRIPTION_QUERY_KEY(...keyParams), response);
};

interface GetSubscriptionProps extends SingleQueryParams {
  subscriptionId: string;
}

export const GetSubscription = async ({
  subscriptionId,
  adminApiParams,
}: GetSubscriptionProps): Promise<ConnectedXMResponse<Subscription>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/subscriptions/${subscriptionId}`);
  return data;
};

export const useGetSubscription = (
  subscriptionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSubscription>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSubscription>>(
    SUBSCRIPTION_QUERY_KEY(subscriptionId),
    (params: SingleQueryParams) =>
      GetSubscription({ subscriptionId, ...params }),
    {
      ...options,
      enabled: !!subscriptionId && (options?.enabled ?? true),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
    },
    "subscriptions"
  );
};