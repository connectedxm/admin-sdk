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
 * Endpoint to retrieve a Cognito user associated with a specific account using their username.
 * This function allows fetching detailed information about a Cognito user linked to an account.
 * It is useful in scenarios where user-specific data is required for account management or user verification.
 * @name GetAccountCognitoUser
 * @param {string} accountId (path) - The id of the account
 * @param {string} username (path) - The username of the Cognito user
 * @version 1.3
 **/
export const ACCOUNT_COGNITO_USER_QUERY_KEY = (
  accountId: string,
  username: string
) => [...ACCOUNT_COGNITO_USERS_QUERY_KEY(accountId), username];

interface GetAccountCognitoUserProps extends SingleQueryParams {
  accountId: string;
  username: string;
}

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