import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { CognitoUser } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";

/**
 * @category Keys
 * @group Accounts
 */
export const ACCOUNT_COGNITO_USERS_QUERY_KEY = (accountId: string) => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "COGNITO_USERS",
];

interface GetAccountCognitoUsersProps extends InfiniteQueryParams {
  accountId: string;
}

/**
 * @category Queries
 * @group Accounts
 */
export const GetAccountCognitoUsers = async ({
  accountId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAccountCognitoUsersProps): Promise<
  ConnectedXMResponse<CognitoUser[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/accounts/${accountId}/cognito`, {
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
 * @group Accounts
 */
export const useGetAccountCognitoUsers = (
  accountId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountCognitoUsers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountCognitoUsers>>
  >(
    ACCOUNT_COGNITO_USERS_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetAccountCognitoUsers({ accountId, ...params }),
    params,
    {
      ...options,
      enabled: !!accountId && (options.enabled ?? true),
    },
    "accounts"
  );
};
