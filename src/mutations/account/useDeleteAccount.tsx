import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { ACCOUNT_QUERY_KEY } from "@queries/accounts/useGetAccount";
import { ACCOUNTS_QUERY_KEY } from "@queries/accounts/useGetAccounts";
import { useRouter } from "next/router";

interface DeleteAccountParams {
  accountId: string;
}

export const DeleteAccount = async ({
  accountId,
}: DeleteAccountParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(`/accounts/${accountId}`);
  return data;
};

export const useDeleteAccount = (accountId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useConnectedMutation(() => DeleteAccount({ accountId }), {
    onSuccess: async (_response: Awaited<ReturnType<typeof DeleteAccount>>) => {
      await router.push("/accounts");
      queryClient.invalidateQueries(ACCOUNTS_QUERY_KEY());
      queryClient.removeQueries(ACCOUNT_QUERY_KEY(accountId));
    },
  });
};

export default useDeleteAccount;
