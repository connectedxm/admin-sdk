import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Account } from "@interfaces";
import { SET_ACCOUNT_QUERY_DATA } from "@context/queries/accounts/useGetAccount";
import { ACCOUNT_INTERESTS_QUERY_KEY } from "@context/queries/accounts/useGetAccountInterests";

interface AddAccountInterestParams {
  accountId: string;
  interestId: string;
}

export const AddAccountInterest = async ({
  accountId,
  interestId,
}: AddAccountInterestParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/accounts/${accountId}/interests/${interestId}`
  );
  return data;
};

export const useAddAccountInterest = (accountId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (interestId: string) => AddAccountInterest({ accountId, interestId }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof AddAccountInterest>>) => {
        SET_ACCOUNT_QUERY_DATA(queryClient, [accountId], response);
        queryClient.invalidateQueries(ACCOUNT_INTERESTS_QUERY_KEY(accountId));
      },
    }
  );
};

export default useAddAccountInterest;
