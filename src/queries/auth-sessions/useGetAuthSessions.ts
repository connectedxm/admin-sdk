import { GetAdminAPI } from "@src/AdminAPI";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse, AuthSession } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * Endpoint to retrieve a list of authentication sessions.
 * This function fetches authentication session data, which can be used to monitor and manage user sessions.
 * It is designed for applications that require detailed tracking of user authentication activities.
 * @name GetAuthSessions
 * @version 1.2
 **/

export const AUTH_SESSIONS_QUERY_KEY = () => {
  const keys = ["AUTH_SESSIONS"];
  return keys;
};

export const SET_AUTH_SESSIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof AUTH_SESSIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAuthSessions>>
) => {
  client.setQueryData(AUTH_SESSIONS_QUERY_KEY(...keyParams), response);
};

interface GetAuthSessionsParams extends InfiniteQueryParams {}

export const GetAuthSessions = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAuthSessionsParams): Promise<ConnectedXMResponse<AuthSession[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/logs/auth-sessions`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetAuthSessions = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAuthSessions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetAuthSessions>>>(
    AUTH_SESSIONS_QUERY_KEY(),
    (params: InfiniteQueryParams) =>
      GetAuthSessions({
        ...params,
      }),
    params,
    options,
    "org"
  );
};