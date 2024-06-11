import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { SubscriptionPayment } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

export const SUBSCRIPTION_PAYMENTS_QUERY_KEY = () => ["SUBSCRIPTIONS"];

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
}: GetSubscriptionPaymentsProps): Promise<
  ConnectedXMResponse<SubscriptionPayment[]>
> => {
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
    SUBSCRIPTION_PAYMENTS_QUERY_KEY(),
    (params: InfiniteQueryParams) =>
      GetSubscriptionPayments({ ...params, subscriptionId }),
    params,
    {
      ...options,
      enabled: !!subscriptionId && (options.enabled ?? true),
    }
  );
};
