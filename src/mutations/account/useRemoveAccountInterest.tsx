import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Account } from "@interfaces";
import { SET_ACCOUNT_QUERY_DATA } from "@context/queries/accounts/useGetAccount";
import { ACCOUNT_INTERESTS_QUERY_KEY } from "@context/queries/accounts/useGetAccountInterests";

interface RemoveAccountInterestParams {
  accountId: string;
  interestId: string;
}

export const RemoveAccountInterest = async ({
  accountId,
  interestId,
}: RemoveAccountInterestParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/accounts/${accountId}/interests/${interestId}`
  );
  return data;
};

export const useRemoveAccountInterest = (accountId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (interestId: string) => RemoveAccountInterest({ accountId, interestId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof RemoveAccountInterest>>
      ) => {
        SET_ACCOUNT_QUERY_DATA(queryClient, [accountId], response);
        queryClient.invalidateQueries(ACCOUNT_INTERESTS_QUERY_KEY(accountId));
      },
    },
    undefined,
    true
  );
};

export default useRemoveAccountInterest;
