import { GetAdminAPI } from "@src/AdminAPI";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse, AuthSession } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Key
 * @group Emails
 */
export const AUTH_SESSIONS_QUERY_KEY = () => {
  const keys = ["AUTH_SESSIONS"];
  return keys;
};

/**
 * @category Setters
 * @group Emails
 */
export const SET_AUTH_SESSIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof AUTH_SESSIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAuthSessions>>
) => {
  client.setQueryData(AUTH_SESSIONS_QUERY_KEY(...keyParams), response);
};

interface GetAuthSessionsParams extends InfiniteQueryParams {}

/**
 * @category Query
 * @group Emails
 */
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

/**
 * @category Hooks
 * @group Emails
 */
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
