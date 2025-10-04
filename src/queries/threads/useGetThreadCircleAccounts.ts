import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  ThreadCircleAccount,
  ThreadCircleAccountRole,
} from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { THREAD_CIRCLE_QUERY_KEY } from "./useGetThreadCircle";

/**
 * @category Keys
 * @group Threads
 */
export const THREAD_CIRCLE_ACCOUNTS_QUERY_KEY = (
  circleId: string,
  role?: keyof typeof ThreadCircleAccountRole
) => {
  const key = [...THREAD_CIRCLE_QUERY_KEY(circleId), "ACCOUNTS"];
  if (role) {
    key.push(role);
  }
  return key;
};

/**
 * @category Setters
 * @group Threads
 */
export const SET_THREAD_CIRCLE_ACCOUNTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_CIRCLE_ACCOUNTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetThreadCircleAccounts>>
) => {
  client.setQueryData(THREAD_CIRCLE_ACCOUNTS_QUERY_KEY(...keyParams), response);
};

interface GetThreadCircleAccountsProps extends InfiniteQueryParams {
  circleId: string;
  role?: keyof typeof ThreadCircleAccountRole;
}

/**
 * @category Queries
 * @group Threads
 */
export const GetThreadCircleAccounts = async ({
  circleId,
  role,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetThreadCircleAccountsProps): Promise<
  ConnectedXMResponse<ThreadCircleAccount[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/threads/circles/${circleId}/accounts`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      role: role || undefined,
    },
  });
  return data;
};

/**
 * @category Hooks
 * @group Threads
 */
export const useGetThreadCircleAccounts = (
  circleId: string,
  role?: keyof typeof ThreadCircleAccountRole,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetThreadCircleAccounts>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetThreadCircleAccounts>>
  >(
    THREAD_CIRCLE_ACCOUNTS_QUERY_KEY(circleId, role),
    (params: InfiniteQueryParams) =>
      GetThreadCircleAccounts({ circleId, role, ...params }),
    params,
    {
      ...options,
      enabled: !!circleId && (options.enabled ?? true),
    }
  );
};
