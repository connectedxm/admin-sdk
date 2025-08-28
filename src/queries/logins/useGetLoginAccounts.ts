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
export const LOGIN_ACCOUNTS_QUERY_KEY = (sub: string) => [
  ...LOGIN_QUERY_KEY(sub),
  "ACCOUNTS",
];

interface GetLoginAccountsProps extends InfiniteQueryParams {
  sub: string;
}

/**
 * @category Queries
 * @group Logins
 */
export const GetLoginAccounts = async ({
  sub,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetLoginAccountsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/logins/${sub}/accounts`, {
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
  sub: string = "",
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
    LOGIN_ACCOUNTS_QUERY_KEY(sub),
    (queryParams: InfiniteQueryParams) =>
      GetLoginAccounts({ sub, ...queryParams }),
    params,
    {
      ...options,
      enabled: !!sub && (options.enabled ?? true),
    },
    "accounts"
  );
};
