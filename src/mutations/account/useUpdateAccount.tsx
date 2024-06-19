import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { Account } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { SET_ACCOUNT_QUERY_DATA } from "@queries/accounts/useGetAccount";
import { ACCOUNTS_QUERY_KEY } from "@context/queries/accounts/useGetAccounts";

interface UpdateAccountParams {
  accountId: string;
  account: Account;
}

export const UpdateAccount = async ({
  accountId,
  account,
}: UpdateAccountParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(`/accounts/${accountId}`, account);
  return data;
};

export const useUpdateAccount = (accountId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<Account>(
    (account: Account) => UpdateAccount({ accountId, account }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof UpdateAccount>>) => {
        queryClient.invalidateQueries(ACCOUNTS_QUERY_KEY());
        SET_ACCOUNT_QUERY_DATA(queryClient, [accountId], response);
      },
    }
  );
};

export default useUpdateAccount;
