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
 * @param {string} accountId - The id of the account
 * @param {string} username - The username of the Cognito user
 * @version 1.2
 **/

export const ACCOUNT_COGNITO_USER_QUERY_KEY = (
  accountId: string,
  username: string
) => [...ACCOUNT_COGNITO_USERS_QUERY_KEY(accountId), username];

interface GetAccountCognitoUserProps extends SingleQueryParams {
  accountId: string;
  username: