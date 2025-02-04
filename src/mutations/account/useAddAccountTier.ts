import { Account, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ACCOUNT_TIERS_QUERY_KEY, SET_ACCOUNT_QUERY_DATA } from "@src/queries";

/**
 * Endpoint to add a tier to a specified account and update the query client.
 * This function allows the addition of a specific tier to an account, ensuring that the query client is updated accordingly.
 * It is designed for use in applications where account tier management is required.
 * @name AddAccountTier
 * @param {string} accountId - The id of the account
 * @param {string} tierId - The id of the tier
 * @version 1.2
 **/
export interface AddAccountTierParams extends MutationParams {
  accountId: string;
  tierId: string;
}

export const AddAccountTier = async ({
  accountId,
  tierId,
  adminApiParams,
  queryClient,
}: AddAccountTierParams): Promise<ConnectedXMResponse<Account>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Account>>(
    `/accounts/${accountId}/tiers/${tierId}`
  );
  if (queryClient && data.status === "ok") {
    SET_ACCOUNT_QUERY_DATA(queryClient, [accountId], data);
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_TIERS_QUERY_KEY(accountId),
    });
  }
  return data;
};

export const useAddAccountTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddAccountTier>>,
      Omit<AddAccountTierParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddAccountTierParams,
    Awaited<ReturnType<typeof AddAccountTier>>
  >(AddAccountTier, options, {
    domain: "accounts",
    type: "update",
  });
};

export default useAddAccountTier;