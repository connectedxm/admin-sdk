import { Account, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ACCOUNT_TIERS_QUERY_KEY, SET_ACCOUNT_QUERY_DATA } from "@src/queries";

/**
 * Endpoint to remove a tier from a specified account.
 * This function allows the removal of a specific tier from an account by providing the account ID and the tier ID.
 * It is used in scenarios where account tier management is required, ensuring that the specified tier is detached from the account.
 * @name RemoveAccountTier
 * @param {string} accountId - The id of the account
 * @param {string} tierId - The id of the tier to be removed
 * @version 1.2
 **/

export interface RemoveAccountTierParams extends MutationParams {
  accountId: string;
  tierId: string;
}

export const RemoveAccountTier = async ({
  accountId,
  tierId,
  adminApiParams,
  queryClient,
}: RemoveAccountTierParams): Promise<ConnectedXMResponse<Account>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<Account>>(
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

export const useRemoveAccountTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveAccountTier>>,
      Omit<RemoveAccountTierParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveAccountTierParams,
    Awaited<ReturnType<typeof RemoveAccountTier>>
  >(RemoveAccountTier, options, {
    domain: "accounts",
    type: "update",
  });
};