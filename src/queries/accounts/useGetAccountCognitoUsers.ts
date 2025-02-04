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
 * Retrieves the Cognito users associated with a specific account.
 * This function fetches a list of Cognito users linked to a given account ID, 
 * providing detailed user information for applications that require user management capabilities.
 * @name GetAccountCognitoUsers
 * @param {string} accountId - The id of the account
 * @version 1.2
 **/

export const ACCOUNT_COGNITO_USERS_QUERY_KEY = (accountId: string) => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "COGNITO_USERS",
];

interface GetAccountCognitoUsersProps extends InfiniteQueryParams {
  accountId: string;
}

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