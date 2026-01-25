import { Account, ConnectedXMResponse } from "@src/interfaces";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { THREAD_QUERY_KEY } from "../useGetThread";

/**
 * @category Keys
 * @thread Thread Accounts
 */
export const THREAD_ACCOUNTS_QUERY_KEY = (threadId: string) => {
  const key = [...THREAD_QUERY_KEY(threadId), "ACCOUNTS"];
  return key;
};

interface GetThreadAccountsProps extends InfiniteQueryParams {
  threadId: string;
}

/**
 * @category Queries
 * @thread Thread Accounts
 */
export const GetThreadAccounts = async ({
  threadId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetThreadAccountsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/threads/${threadId}/accounts`, {
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
 * @thread Thread Accounts
 */
export const useGetThreadAccounts = (
  threadId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetThreadAccounts>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetThreadAccounts>>
  >(
    THREAD_ACCOUNTS_QUERY_KEY(threadId),
    (params: InfiniteQueryParams) => GetThreadAccounts({ ...params, threadId }),
    params,
    {
      ...options,
      enabled: !!threadId && (options.enabled ?? true),
    }
  );
};
