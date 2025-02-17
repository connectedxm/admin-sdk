import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";

import { Login } from "@src/interfaces";
import { ACCOUNT_LOGINS_QUERY_KEY } from "./useGetAccountLogins";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Accounts
 */
export const ACCOUNT_LOGIN_QUERY_KEY = (
  accountId: string,
  username: string
) => [...ACCOUNT_LOGINS_QUERY_KEY(accountId), username];

interface GetAccountLoginProps extends SingleQueryParams {
  accountId: string;
  username: string;
}

/**
 * @category Queries
 * @group Accounts
 */
export const GetAccountLogin = async ({
  accountId,
  username,
  adminApiParams,
}: GetAccountLoginProps): Promise<ConnectedXMResponse<Login>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/accounts/${accountId}/cognito/${username}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Accounts
 */
export const useGetAccountLogin = (
  accountId: string = "",
  username: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetAccountLogin>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetAccountLogin>>(
    ACCOUNT_LOGIN_QUERY_KEY(accountId, username),
    (params: SingleQueryParams) =>
      GetAccountLogin({ accountId: accountId, username, ...params }),
    {
      ...options,
      enabled: !!accountId && !!username && (options?.enabled ?? true),
    },
    "accounts"
  );
};
