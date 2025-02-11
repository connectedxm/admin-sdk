import { GetAdminAPI } from "@src/AdminAPI";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse, AuthSession } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";

/**
 * Retrieves authentication sessions for a specific account.
 * This endpoint allows fetching a list of authentication sessions associated with a given account ID.
 * It is useful for applications that need to display or manage authentication sessions for user accounts.
 * @name GetAccountAuthSessions
 * @param {string} accountId (path) The id of the account
 * @version 1.3
 **/

export const ACCOUNT_AUTH_SESSIONS_QUERY_KEY = (accountId: string) => {
  const keys = [...ACCOUNT_QUERY_KEY(accountId), "AUTH_SESSIONS"];
  return keys;
};

export const SET_ACCOUNT_AUTH_SESSIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_AUTH_SESSIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountAuthSessions>>
) => {
  client.setQueryData(ACCOUNT_AUTH_SESSIONS_QUERY_KEY(...keyParams), response);
};

interface GetAccountAuthSessionsParams extends InfiniteQueryParams {
  accountId: string;
}

export const GetAccountAuthSessions = async ({
  accountId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAccountAuthSessionsParams): Promise<
  ConnectedXMResponse<AuthSession[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/accounts/${accountId}/auth-sessions`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetAccountAuthSessions = (
  accountId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountAuthSessions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountAuthSessions>>
  >(
    ACCOUNT_AUTH_SESSIONS_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetAccountAuthSessions({
        accountId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!accountId && (options.enabled ?? true),
    },
    "accounts"
  );
};
