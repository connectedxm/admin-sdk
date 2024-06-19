import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Account } from "@interfaces";
import { SET_ACCOUNT_QUERY_DATA } from "@context/queries/accounts/useGetAccount";
import { ACCOUNT_DELEGATES_QUERY_KEY } from "@context/queries/accounts/useGetAccountDelegates";

interface RemoveAccountDelegateParams {
  accountId: string;
  delegateId: string;
}

export const RemoveAccountDelegate = async ({
  accountId,
  delegateId,
}: RemoveAccountDelegateParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/accounts/${accountId}/delegates/${delegateId}`
  );
  return data;
};

export const useRemoveAccountDelegate = (accountId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (delegateId: string) => RemoveAccountDelegate({ accountId, delegateId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof RemoveAccountDelegate>>
      ) => {
        SET_ACCOUNT_QUERY_DATA(queryClient, [accountId], response);
        queryClient.invalidateQueries(ACCOUNT_DELEGATES_QUERY_KEY(accountId));
      },
    },
    undefined,
    true
  );
};

export default useRemoveAccountDelegate;
