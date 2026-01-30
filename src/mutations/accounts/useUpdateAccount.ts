import { Account, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ACCOUNTS_QUERY_KEY, SET_ACCOUNT_QUERY_DATA } from "@src/queries";
import { AccountUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Account
 */
export interface UpdateAccountParams extends MutationParams {
  accountId: string;
  account: AccountUpdateInputs;
}

/**
 * @category Methods
 * @group Account
 */
export const UpdateAccount = async ({
  accountId,
  account,
  adminApiParams,
  queryClient,
}: UpdateAccountParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Account>>(
    `/accounts/${accountId}`,
    account
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY() });
    SET_ACCOUNT_QUERY_DATA(queryClient, [accountId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Account
 */
export const useUpdateAccount = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateAccount>>,
      Omit<UpdateAccountParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateAccountParams,
    Awaited<ReturnType<typeof UpdateAccount>>
  >(UpdateAccount, options);
};
