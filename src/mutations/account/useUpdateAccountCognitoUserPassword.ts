import { Account, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Endpoint to update the password for a Cognito user associated with an account.
 * This function allows updating the password of a Cognito user linked to a specific account.
 * It is intended for use in scenarios where password management for Cognito users is required.
 * @name UpdateAccountCognitoUserPassword
 * @param {string} accountId (path) - The id of the account
 * @param {string} username (path) - The username of the Cognito user
 * @param {string} password (bodyValue) - The new password for the Cognito user
 * @version 1.3
 **/

export interface UpdateAccountCognitoUserPasswordParams extends MutationParams {
  accountId: string;
  username: string;
  password: string;
}

export const UpdateAccountCognitoUserPassword = async ({
  accountId,
  username,
  password,
  adminApiParams,
  queryClient,
}: UpdateAccountCognitoUserPasswordParams): Promise<
  ConnectedXMResponse<Account>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<Account>>(
    `/accounts/${accountId}/cognito/${username}/password`,
    { password }
  );
  if (queryClient && data.status === "ok") {
    UpdateAccountCognitoUserPassword({
      accountId,
      username,
      password,
      adminApiParams,
    });
  }
  return data;
};

export const useUpdateAccountCognitoUserPassword = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateAccountCognitoUserPassword>>,
      Omit<
        UpdateAccountCognitoUserPasswordParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateAccountCognitoUserPasswordParams,
    Awaited<ReturnType<typeof UpdateAccountCognitoUserPassword>>
  >(UpdateAccountCognitoUserPassword, options, {
    domain: "accounts",
    type: "update",
  });
};