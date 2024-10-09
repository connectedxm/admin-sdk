import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";

import { CognitoUser } from "@src/interfaces";
import { ACCOUNT_COGNITO_USERS_QUERY_KEY } from "./useGetAccountCognitoUsers";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Accounts
 */
export const ACCOUNT_COGNITO_USER_QUERY_KEY = (
  accountId: string,
  username: string
) => [...ACCOUNT_COGNITO_USERS_QUERY_KEY(accountId), username];

interface GetAccountCognitoUserProps extends SingleQueryParams {
  accountId: string;
  username: string;
}

/**
 * @category Queries
 * @group Accounts
 */
export const GetAccountCognitoUser = async ({
  accountId,
  username,
  adminApiParams,
}: GetAccountCognitoUserProps): Promise<ConnectedXMResponse<CognitoUser>> => {
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
export const useGetAccountCognitoUser = (
  accountId: string = "",
  username: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetAccountCognitoUser>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetAccountCognitoUser>>(
    ACCOUNT_COGNITO_USER_QUERY_KEY(accountId, username),
    (params: SingleQueryParams) =>
      GetAccountCognitoUser({ accountId: accountId, username, ...params }),
    {
      ...options,
      enabled: !!accountId && !!username && (options?.enabled ?? true),
    },
    "accounts"
  );
};
