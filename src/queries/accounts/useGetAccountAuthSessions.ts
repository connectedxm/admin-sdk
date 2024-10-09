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
 * @category Key
 * @group Emails
 */
export const ACCOUNT_AUTH_SESSIONS_QUERY_KEY = (accountId: string) => {
  const keys = [...ACCOUNT_QUERY_KEY(accountId), "AUTH_SESSIONS"];
  return keys;
};

/**
 * @category Setters
 * @group Emails
 */
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

/**
 * @category Query
 * @group Emails
 */
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

/**
 * @category Hooks
 * @group Emails
 */
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
