import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { Account } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { SET_ACCOUNT_QUERY_DATA } from "@context/queries/accounts/useGetAccount";
import { ACCOUNTS_QUERY_KEY } from "@context/queries/accounts/useGetAccounts";

interface CreateAccountParams {
  account: Account;
}

export const CreateAccount = async ({
  account,
}: CreateAccountParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(`/accounts`, account);
  return data;
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useConnectedMutation<Account>(
    (account: Account) => CreateAccount({ account }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof CreateAccount>>) => {
        queryClient.invalidateQueries(ACCOUNTS_QUERY_KEY());
        SET_ACCOUNT_QUERY_DATA(queryClient, [response.data.id], response);
      },
    }
  );
};

export default useCreateAccount;
