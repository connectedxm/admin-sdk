import { GetAdminAPI } from "@src/AdminAPI";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse, AuthSession } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { LOGIN_QUERY_KEY } from "../logins/useGetLogin";

/**
 * @category Key
 * @group Emails
 */
export const LOGIN_AUTH_SESSIONS_QUERY_KEY = (loginId: string) => {
  const keys = [...LOGIN_QUERY_KEY(loginId), "AUTH_SESSIONS"];
  return keys;
};

/**
 * @category Setters
 * @group Emails
 */
export const SET_LOGIN_AUTH_SESSIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof LOGIN_AUTH_SESSIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetLoginAuthSessions>>
) => {
  client.setQueryData(LOGIN_AUTH_SESSIONS_QUERY_KEY(...keyParams), response);
};

interface GetLoginAuthSessionsParams extends InfiniteQueryParams {
  username: string;
}

/**
 * @category Query
 * @group Emails
 */
export const GetLoginAuthSessions = async ({
  username,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetLoginAuthSessionsParams): Promise<ConnectedXMResponse<AuthSession[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/logins/${username}/auth-sessions`, {
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
export const useGetLoginAuthSessions = (
  username: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetLoginAuthSessions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetLoginAuthSessions>>
  >(
    LOGIN_AUTH_SESSIONS_QUERY_KEY(username),
    (params: InfiniteQueryParams) =>
      GetLoginAuthSessions({
        username,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!username && (options.enabled ?? true),
    },
    "accounts"
  );
};
