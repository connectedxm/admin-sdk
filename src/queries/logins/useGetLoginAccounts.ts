import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Account } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { LOGIN_QUERY_KEY } from "./useGetLogin";

/**
 * @category Keys
 * @group Logins
 */
export const LOGIN_ACCOUNTS_QUERY_KEY = (username: string) => [
  ...LOGIN_QUERY_KEY(username),
  "ACCOUNTS",
];

interface GetLoginAccountsProps extends InfiniteQueryParams {
  username: string;
}

/**
 * @category Queries
 * @group Logins
 */
export const GetLoginAccounts = async ({
  username,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetLoginAccountsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/logins/${username}/accounts`, {
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
 * @group Logins
 */
export const useGetLoginAccounts = (
  username: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetLoginAccounts>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetLoginAccounts>>
  >(
    LOGIN_ACCOUNTS_QUERY_KEY(username),
    (queryParams: InfiniteQueryParams) =>
      GetLoginAccounts({ username, ...queryParams }),
    params,
    {
      ...options,
      enabled: !!username && (options.enabled ?? true),
    },
    "accounts"
  );
};
