import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Event } from "@src/interfaces";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Accounts
 */
export const ACCOUNT_EVENTS_QUERY_KEY = (accountId: string, past?: boolean) => {
  const keys = [...ACCOUNT_QUERY_KEY(accountId), "EVENTS"];

  if (typeof past !== "undefined") {
    keys.push(past ? "PAST" : "UPCOMING");
  }

  return keys;
};

/**
 * @category Setters
 * @group Accounts
 */
export const SET_ACCOUNT_EVENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_EVENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountEvents>>
) => {
  client.setQueryData(ACCOUNT_EVENTS_QUERY_KEY(...keyParams), response);
};

interface GetAccountEventsProps extends InfiniteQueryParams {
  accountId: string;
  past?: boolean;
}

/**
 * @category Queries
 * @group Accounts
 */
export const GetAccountEvents = async ({
  accountId,
  pageParam,
  pageSize,
  orderBy,
  past,
  search,
  adminApiParams,
}: GetAccountEventsProps): Promise<ConnectedXMResponse<Event[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/accounts/${accountId}/events`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      past: past ? "true" : undefined,
      search: search || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Accounts
 */
export const useGetAccountEvents = (
  accountId: string = "",
  past?: boolean,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountEvents>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountEvents>>
  >(
    ACCOUNT_EVENTS_QUERY_KEY(accountId, past),
    (params: InfiniteQueryParams) =>
      GetAccountEvents({ accountId, past, ...params }),
    params,
    {
      ...options,
      enabled: !!accountId && (options?.enabled ?? true),
    },
    "accounts"
  );
};
