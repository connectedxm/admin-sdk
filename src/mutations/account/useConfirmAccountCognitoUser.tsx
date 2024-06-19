import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { Account } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { ACCOUNT_COGNITO_USER_QUERY_KEY } from "@context/queries/accounts/useGetAccountCognitoUser";
import { ACCOUNT_COGNITO_USERS_QUERY_KEY } from "@context/queries/accounts/useGetAccountCognitoUsers";

interface ConfirmAccountCognitoUserParams {
  accountId: string;
  username: string;
}

export const ConfirmAccountCognitoUser = async ({
  accountId,
  username,
}: ConfirmAccountCognitoUserParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/accounts/${accountId}/cognito/${username}/confirm`
  );
  return data;
};

export const useConfirmAccountCognitoUser = (
  accountId: string,
  username: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation<any>(
    () => ConfirmAccountCognitoUser({ accountId, username }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(
          ACCOUNT_COGNITO_USERS_QUERY_KEY(accountId)
        );
        queryClient.invalidateQueries(
          ACCOUNT_COGNITO_USER_QUERY_KEY(accountId, username)
        );
      },
    }
  );
};

export default useConfirmAccountCognitoUser;
