import { Account, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import {
  ACCOUNT_COGNITO_USERS_QUERY_KEY,
  ACCOUNT_COGNITO_USER_QUERY_KEY,
} from "@src/queries";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Endpoint to confirm a Cognito user account associated with a specific account ID and username.
 * This function is used to confirm the status of a Cognito user within an account, ensuring that the user is recognized and validated by the system.
 * It is particularly useful in scenarios where user confirmation is required for account activation or access.
 * @name ConfirmAccountCognitoUser
 * @param {string} accountId (path) - The id of the account
 * @param {string} username (path) - The username of the Cognito user
 * @version 1.3
 **/
export interface ConfirmAccountCognitoUserParams extends MutationParams {
  accountId: string;
  username: string;
}

export const ConfirmAccountCognitoUser = async ({
  accountId,
  username,
  adminApiParams,
  queryClient,
}: ConfirmAccountCognitoUserParams): Promise<ConnectedXMResponse<Account>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<Account>>(
    `/accounts/${accountId}/cognito/${username}/confirm`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_COGNITO_USERS_QUERY_KEY(accountId),
    });
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_COGNITO_USER_QUERY_KEY(accountId, username),
    });
  }
  return data;
};

export const useConfirmAccountCognitoUser = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ConfirmAccountCognitoUser>>,
      Omit<ConfirmAccountCognitoUserParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ConfirmAccountCognitoUserParams,
    Awaited<ReturnType<typeof ConfirmAccountCognitoUser>>
  >(ConfirmAccountCognitoUser, options, {
    domain: "accounts",
    type: "update",
  });
};