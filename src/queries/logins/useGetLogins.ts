import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Login } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

/**
 * @category Keys
 * @group Logins
 */
export const LOGINS_QUERY_KEY = (accountId?: string) => {
  const key = ["LOGINS"];
  if (accountId) {
    key.push(accountId);
  }
  return key;
};

interface GetLoginsProps extends InfiniteQueryParams {
  accountId?: string;
}

/**
 * @category Queries
 * @group Logins
 */
export const GetLogins = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  accountId,
  adminApiParams,
}: GetLoginsProps): Promise<ConnectedXMResponse<Login[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/logins`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      accountId: accountId || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Logins
 */
export const useGetLogins = (
  accountId?: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetLogins>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetLogins>>>(
    LOGINS_QUERY_KEY(accountId),
    (queryParams: InfiniteQueryParams) =>
      GetLogins({ ...params, ...queryParams, accountId }),
    params,
    {
      ...options,
      enabled: options.enabled ?? true,
    }
  );
};
