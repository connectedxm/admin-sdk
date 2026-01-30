import { Account, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  ACCOUNT_TIERS_QUERY_KEY,
  SET_ACCOUNT_QUERY_DATA,
  TIER_ACCOUNTS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Account
 */
export interface RemoveAccountTierParams extends MutationParams {
  accountId: string;
  tierId: string;
}

/**
 * @category Methods
 * @group Account
 */
export const RemoveAccountTier = async ({
  accountId,
  tierId,
  adminApiParams,
  queryClient,
}: RemoveAccountTierParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<Account>>(
    `/accounts/${accountId}/tiers/${tierId}`
  );

  if (queryClient && data.status === "ok") {
    SET_ACCOUNT_QUERY_DATA(queryClient, [accountId], data);
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_TIERS_QUERY_KEY(accountId),
    });
    queryClient.invalidateQueries({
      queryKey: TIER_ACCOUNTS_QUERY_KEY(tierId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Account
 */
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
  >(RemoveAccountTier, options);
};
