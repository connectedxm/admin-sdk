import { Account, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
/**
 * @category Params
 * @group Account
 */
export interface UpdateAccountCognitoUserPasswordParams extends MutationParams {
  accountId: string;
  username: string;
  password: string;
}

/**
 * @category Methods
 * @group Account
 */
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

/**
 * @category Mutations
 * @group Account
 */
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
