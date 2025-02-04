import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Subscription } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";
import { QueryClient } from "@tanstack/react-query";

/**
 * Endpoint to retrieve a list of subscriptions associated with a specific account.
 * This function allows users to fetch subscription details for a given account ID.
 * It is designed to be used in applications where account subscription information is required.
 * @name GetAccountSubscriptions
 * @param {string} accountId - The id of the account
 * @version 1.2
 **/

export const ACCOUNT_SUBSCRIPTIONS_QUERY_KEY = (accountId: string) => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "SUBSCRIPTIONS",
];

export const SET_ACCOUNT_SUBSCRIPTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_SUBSCRIPTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountSubscriptions>>
) => {
  client.setQueryData(ACCOUNT_SUBSCRIPTIONS_QUERY_KEY(...keyParams), response);
};

interface GetAccountSubscriptionsProps extends InfiniteQueryParams {
  accountId: string;
}

export const GetAccountSubscriptions = async ({
  accountId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAccountSubscriptionsProps): Promise<
  ConnectedXMResponse<Subscription[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/accounts/${accountId}/subscriptions`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetAccountSubscriptions = (
  accountId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountSubscriptions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountSubscriptions>>
  >(
    ACCOUNT_SUBSCRIPTIONS_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetAccountSubscriptions({ accountId, ...params }),
    params,
    {
      ...options,
      enabled: !!accountId && (options?.enabled ?? true),
    },
    "accounts"
  );
};