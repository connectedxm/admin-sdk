import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Account } from "@interfaces";
import { ACCOUNT_FOLLOWERS_QUERY_KEY } from "@context/queries/accounts/useGetAccountFollowers";
import { SET_ACCOUNT_QUERY_DATA } from "@context/queries/accounts/useGetAccount";

interface RemoveAccountFollowerParams {
  accountId: string;
  followerId: string;
}

export const RemoveAccountFollower = async ({
  accountId,
  followerId,
}: RemoveAccountFollowerParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/accounts/${accountId}/followers/${followerId}`
  );
  return data;
};

export const useRemoveAccountFollower = (accountId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (followerId: string) => RemoveAccountFollower({ accountId, followerId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof RemoveAccountFollower>>
      ) => {
        SET_ACCOUNT_QUERY_DATA(queryClient, [accountId], response);
        queryClient.invalidateQueries(ACCOUNT_FOLLOWERS_QUERY_KEY(accountId));
      },
    },
    undefined,
    true
  );
};

export default useRemoveAccountFollower;
