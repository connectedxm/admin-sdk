import { Account, ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ACCOUNT_TIERS_QUERY_KEY, SET_ACCOUNT_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group Account
 */
export interface AddAccountTierParams extends MutationParams {
  accountId: string;
  tierId: string;
}

/**
 * @category Methods
 * @group Account
 */
export const AddAccountTier = async ({
  accountId,
  tierId,
  adminApiParams,
  queryClient,
}: AddAccountTierParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post(
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

/**
 * @category Mutations
 * @group Account
 */
export const useAddAccountTier = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddAccountTier>>,
      Omit<AddAccountTierParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddAccountTierParams,
    Awaited<ReturnType<typeof AddAccountTier>>
  >(AddAccountTier, options);
};

export default useAddAccountTier;
