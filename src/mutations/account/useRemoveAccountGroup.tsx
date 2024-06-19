import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { Account } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { ACCOUNT_GROUPS_QUERY_KEY } from "@context/queries/accounts/useGetAccountGroups";

interface RemoveAccountGroupParams {
  accountId: string;
  groupId: string;
}

export const RemoveAccountGroup = async ({
  accountId,
  groupId,
}: RemoveAccountGroupParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/accounts/${accountId}/groups/${groupId}`
  );
  return data;
};

export const useRemoveAccountGroup = (accountId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (groupId: string) => RemoveAccountGroup({ accountId, groupId }),
    {
      // NOTE: this doesnt return account like the rest of them. Kinda weird. - ROB
      onSuccess: (
        _response: Awaited<ReturnType<typeof RemoveAccountGroup>>
      ) => {
        queryClient.invalidateQueries(ACCOUNT_GROUPS_QUERY_KEY(accountId));
      },
    },
    undefined,
    true
  );
};

export default useRemoveAccountGroup;
