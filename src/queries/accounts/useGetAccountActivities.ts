import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Activity } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";

/**
 * Endpoint to retrieve a list of activities associated with a specific account.
 * This function fetches activity data for a given account, allowing users to view detailed activity logs.
 * It is designed to be used in applications where tracking account activities is necessary.
 * @name GetAccountActivities
 * @param {string} accountId (path) The id of the account
 * @version 1.3
 **/

export const ACCOUNT_ACTIVITIES_QUERY_KEY = (accountId: string) => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "ACTIVITIES",
];

export const SET_ACCOUNT_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountActivities>>
) => {
  client.setQueryData(ACCOUNT_ACTIVITIES_QUERY_KEY(...keyParams), response);
};

interface GetAccountActivitiesProps extends InfiniteQueryParams {
  accountId: string;
}

export const GetAccountActivities = async ({
  accountId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAccountActivitiesProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/accounts/${accountId}/activities`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetAccountActivities = (
  accountId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountActivities>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountActivities>>
  >(
    ACCOUNT_ACTIVITIES_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetAccountActivities({ accountId, ...params }),
    params,
    {
      ...options,
      enabled: !!accountId && (options?.enabled ?? true),
    },
    "accounts"
  );
};
