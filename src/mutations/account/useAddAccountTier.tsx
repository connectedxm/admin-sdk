import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { Account } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { SET_ACCOUNT_QUERY_DATA } from "@context/queries/accounts/useGetAccount";
import { ACCOUNT_TIERS_QUERY_KEY } from "@context/queries/accounts/useGetAccountTiers";

interface AddAccountTierParams {
  accountId: string;
  tierId: string;
}

export const AddAccountTier = async ({
  accountId,
  tierId,
}: AddAccountTierParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/accounts/${accountId}/tiers/${tierId}`
  );
  return data;
};

export const useAddAccountTier = (accountId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<Omit<AddAccountTierParams, "accountId">>(
    ({ tierId }: Omit<AddAccountTierParams, "accountId">) =>
      AddAccountTier({ accountId, tierId }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof AddAccountTier>>) => {
        SET_ACCOUNT_QUERY_DATA(queryClient, [accountId], response);
        queryClient.invalidateQueries(ACCOUNT_TIERS_QUERY_KEY(accountId));
      },
    },
    undefined,
    true
  );
};

export default useAddAccountTier;
