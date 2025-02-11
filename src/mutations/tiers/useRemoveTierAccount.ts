import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Tier } from "@src/interfaces";
import { SET_TIER_QUERY_DATA, TIER_ACCOUNTS_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to remove an account from a specified tier.
 * This function facilitates the removal of an account from a given tier within the system.
 * It is designed to be used in scenarios where account management within tiers is required.
 * @name RemoveTierAccount
 * @param {string} tierId (path) The id of the tier
 * @param {string} accountId (path) The id of the account
 * @version 1.3
 **/

export interface RemoveTierAccountParams extends MutationParams {
  tierId: string;
  accountId: string;
}

export const RemoveTierAccount = async ({
  tierId,
  accountId,
  adminApiParams,
  queryClient,
}: RemoveTierAccountParams): Promise<ConnectedXMResponse<Tier>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<Tier>>(
    `/tiers/${tierId}/accounts/${accountId}`
  );
  if (queryClient && data.status === "ok") {
    SET_TIER_QUERY_DATA(queryClient, [tierId], data);
    queryClient.invalidateQueries({
      queryKey: TIER_ACCOUNTS_QUERY_KEY(tierId),
    });
  }
  return data;
};

export const useRemoveTierAccount = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveTierAccount>>,
      Omit<RemoveTierAccountParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveTierAccountParams,
    Awaited<ReturnType<typeof RemoveTierAccount>>
  >(RemoveTierAccount, options, {
    domain: "accounts",
    type: "update",
  });
};
