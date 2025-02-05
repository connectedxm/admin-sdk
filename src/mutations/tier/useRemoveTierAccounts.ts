import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Tier } from "@src/interfaces";
import { SET_TIER_QUERY_DATA, TIER_ACCOUNTS_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to remove accounts from a specified tier.
 * This function allows the removal of all accounts associated with a given tier ID.
 * It is used in scenarios where accounts need to be disassociated from a tier within an application.
 * @name RemoveTierAccounts
 * @param {string} tierId - The id of the tier
 * @version 1.2
 **/

export interface RemoveTierAccountsParams extends MutationParams {
  tierId: string;
}

export const RemoveTierAccounts = async ({
  tierId,
  adminApiParams,
  queryClient,
}: RemoveTierAccountsParams): Promise<ConnectedXMResponse<Tier>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<Tier>>(
    `/tiers/${tierId}/accounts`
  );
  if (queryClient && data.status === "ok") {
    SET_TIER_QUERY_DATA(queryClient, [tierId], data);
    queryClient.invalidateQueries({
      queryKey: TIER_ACCOUNTS_QUERY_KEY(tierId),
    });
  }
  return data;
};

export const useRemoveTierAccounts = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveTierAccounts>>,
      Omit<RemoveTierAccountsParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveTierAccountsParams,
    Awaited<ReturnType<typeof RemoveTierAccounts>>
  >(RemoveTierAccounts, options, {
    domain: "accounts",
    type: "update",
  });
};