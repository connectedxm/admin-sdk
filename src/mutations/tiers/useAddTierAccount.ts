import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Tier } from "@src/interfaces";
import { SET_TIER_QUERY_DATA, TIER_ACCOUNTS_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to add an account to a specific tier within the system.
 * This function allows the addition of an account to a designated tier by providing the tier and account identifiers.
 * It is used in scenarios where account management and tier allocation are required.
 * @name AddTierAccount
 * @param {string} tierId (path) The id of the tier
 * @param {string} accountId (path) The id of the account
 * @version 1.3
 **/

export interface AddTierAccountParams extends MutationParams {
  tierId: string;
  accountId: string;
}

export const AddTierAccount = async ({
  tierId,
  accountId,
  adminApiParams,
  queryClient,
}: AddTierAccountParams): Promise<ConnectedXMResponse<Tier>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Tier>>(
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

export const useAddTierAccount = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddTierAccount>>,
      Omit<AddTierAccountParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddTierAccountParams,
    Awaited<ReturnType<typeof AddTierAccount>>
  >(AddTierAccount, options, {
    domain: "accounts",
    type: "update",
  });
};
