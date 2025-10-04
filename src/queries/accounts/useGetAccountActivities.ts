import { GetAdminAPI } from "@src/AdminAPI";
import { ActivityStatus, ConnectedXMResponse } from "@src/interfaces";

import { Activity } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";

/**
 * @category Keys
 * @group Accounts
 */
export const ACCOUNT_ACTIVITIES_QUERY_KEY = (
  accountId: string,
  status?: keyof typeof ActivityStatus
) => {
  const key = [...ACCOUNT_QUERY_KEY(accountId), "ACTIVITIES"];
  if (status) {
    key.push(status);
  }
  return key;
};

/**
 * @category Setters
 * @group Accounts
 */
export const SET_ACCOUNT_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountActivities>>
) => {
  client.setQueryData(ACCOUNT_ACTIVITIES_QUERY_KEY(...keyParams), response);
};

interface GetAccountActivitiesProps extends InfiniteQueryParams {
  accountId: string;
  status?: keyof typeof ActivityStatus;
}

/**
 * @category Queries
 * @group Accounts
 */
export const GetAccountActivities = async ({
  accountId,
  status,
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
      status: status || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Accounts
 */
export const useGetAccountActivities = (
  accountId: string = "",
  status?: keyof typeof ActivityStatus,
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
    ACCOUNT_ACTIVITIES_QUERY_KEY(accountId, status),
    (params: InfiniteQueryParams) =>
      GetAccountActivities({ accountId, status, ...params }),
    params,
    {
      ...options,
      enabled: !!accountId && (options?.enabled ?? true),
    }
  );
};
