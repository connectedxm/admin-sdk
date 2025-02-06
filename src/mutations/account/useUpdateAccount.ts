import { Account, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ACCOUNTS_QUERY_KEY, SET_ACCOUNT_QUERY_DATA } from "@src/queries";
import { AccountUpdateInputs } from "@src/params";

/**
 * Endpoint to update an existing account with new details.
 * This function allows for updating the details of a specific account identified by its ID.
 * It is designed to be used in applications where account information needs to be modified.
 * @name UpdateAccount
 * @param {string} accountId (path) - The id of the account
 * @param {AccountUpdateInputs} account (body) - The account details to update
 * @version 1.3
 **/
export interface UpdateAccountParams extends MutationParams {
  accountId: string;
  account: AccountUpdateInputs;
}

export const UpdateAccount = async ({
  accountId,
  account,
  adminApiParams,
  queryClient,
}: UpdateAccountParams): Promise<ConnectedXMResponse<Account>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<Account>>(
    `/accounts/${accountId}`,
    account
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY() });
    SET_ACCOUNT_QUERY_DATA(queryClient, [accountId], data);
  }
  return data;
};

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
  >(UpdateAccount, options, {
    domain: "accounts",
    type: "update",
  });
};