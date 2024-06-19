import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { Account } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { SET_ACCOUNT_QUERY_DATA } from "@context/queries/accounts/useGetAccount";
import { ACCOUNT_TIERS_QUERY_KEY } from "@context/queries/accounts/useGetAccountTiers";

interface RemoveAccountTierParams {
  accountId: string;
  tierId: string;
}

export const RemoveAccountTier = async ({
  accountId,
  tierId,
}: RemoveAccountTierParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/accounts/${accountId}/tiers/${tierId}`
  );
  return data;
};

export const useRemoveAccountTier = (accountId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<Omit<RemoveAccountTierParams, "accountId">>(
    ({ tierId }: Omit<RemoveAccountTierParams, "accountId">) =>
      RemoveAccountTier({ accountId, tierId }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof RemoveAccountTier>>) => {
        SET_ACCOUNT_QUERY_DATA(queryClient, [accountId], response);
        queryClient.invalidateQueries(ACCOUNT_TIERS_QUERY_KEY(accountId));
      },
    },
    undefined,
    true
  );
};

export default useRemoveAccountTier;
