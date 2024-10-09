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
export interface RemoveTierAccountParams extends MutationParams {
  tierId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Tier
 */
export const RemoveTierAccount = async ({
  tierId,
  accountId,
  adminApiParams,
  queryClient,
}: RemoveTierAccountParams): Promise<ConnectedXMResponse<Tier>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<Tier>>(
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

/**
 * @category Mutations
 * @group Tier
 */
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
