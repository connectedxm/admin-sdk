import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Account } from "@interfaces";
import { SET_ACCOUNT_QUERY_DATA } from "@context/queries/accounts/useGetAccount";
import { ACCOUNT_FOLLOWING_QUERY_KEY } from "@context/queries/accounts/useGetAccountFollowing";

interface RemoveAccountFollowingParams {
  accountId: string;
  followingId: string;
}

export const RemoveAccountFollowing = async ({
  accountId,
  followingId,
}: RemoveAccountFollowingParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/accounts/${accountId}/following/${followingId}`
  );
  return data;
};

export const useRemoveAccountFollowing = (accountId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (followingId: string) => RemoveAccountFollowing({ accountId, followingId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof RemoveAccountFollowing>>
      ) => {
        SET_ACCOUNT_QUERY_DATA(queryClient, [accountId], response);
        queryClient.invalidateQueries(ACCOUNT_FOLLOWING_QUERY_KEY(accountId));
      },
    },
    undefined,
    true
  );
};

export default useRemoveAccountFollowing;
