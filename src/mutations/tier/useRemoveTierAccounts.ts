import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Tier } from "@src/interfaces";
import { SET_TIER_QUERY_DATA, TIER_ACCOUNTS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Tier
 */
export interface RemoveTierAccountsParams extends MutationParams {
  tierId: string;
}

/**
 * @category Methods
 * @group Tier
 */
export const RemoveTierAccounts = async ({
  tierId,
  adminApiParams,
  queryClient,
}: RemoveTierAccountsParams): Promise<ConnectedXMResponse<Tier>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<Tier>>(
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

/**
 * @category Mutations
 * @group Tier
 */
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
