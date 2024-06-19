import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { Account } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { SET_ACCOUNT_QUERY_DATA } from "@queries/accounts/useGetAccount";
import { ACCOUNTS_QUERY_KEY } from "@context/queries/accounts/useGetAccounts";

interface ImpersonateAccountParams {
  accountId: string;
  username: string;
}

export const ImpersonateAccount = async ({
  accountId,
  username,
}: ImpersonateAccountParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/accounts/${accountId}/impersonate/${username}`
  );
  return data;
};

export const useImpersonateAccount = (accountId: string, username: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    () => ImpersonateAccount({ accountId, username }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof ImpersonateAccount>>) => {
        queryClient.invalidateQueries(ACCOUNTS_QUERY_KEY());
        SET_ACCOUNT_QUERY_DATA(queryClient, [accountId], response);
      },
    }
  );
};

export default useImpersonateAccount;
