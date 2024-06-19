import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { Account } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateAccountCognitoUserPasswordParams {
  accountId: string;
  username: string;
  password: string;
}

export const UpdateAccountCognitoUserPassword = async ({
  accountId,
  username,
  password,
}: UpdateAccountCognitoUserPasswordParams): Promise<
  ConnectedXMResponse<Account>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/accounts/${accountId}/cognito/${username}/password`,
    { password }
  );
  return data;
};

export const useUpdateAccountCognitoUserPassword = (
  accountId: string,
  username: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (password) =>
      UpdateAccountCognitoUserPassword({ accountId, username, password }),
    {}
  );
};

export default useUpdateAccountCognitoUserPassword;
