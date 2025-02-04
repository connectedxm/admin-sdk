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
 * @category Params
 * @group Account
 */
export interface ConfirmAccountCognitoUserParams extends MutationParams {
  accountId: string;
  username: string;
}

/**
 * @category Methods
 * @group Account
 */
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

/**
 * @category Mutations
 * @group Account
 */
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
