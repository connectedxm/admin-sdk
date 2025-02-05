import { Account, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ACCOUNTS_QUERY_KEY, SET_ACCOUNT_QUERY_DATA } from "@src/queries";
import { GetAdminAPI } from "@src/AdminAPI";
import { AccountCreateInputs } from "@src/params";

/**
 * Endpoint to create a new account within the system.
 * This function allows for the creation of a new account by providing the necessary account details.
 * It is designed to be used in applications where account management is required.
 * @name CreateAccount
 * @param {AccountCreateInputs} account - The account details to be created
 * @version 1.2
 **/
export interface CreateAccountParams extends MutationParams {
  account: AccountCreateInputs;
}

export const CreateAccount = async ({
  account,
  adminApiParams,
  queryClient,
}: CreateAccountParams): Promise<ConnectedXMResponse<Account>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Account>>(
    `/accounts`,
    account
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY() });
    SET_ACCOUNT_QUERY_DATA(queryClient, [data?.data.id], data);
  }
  return data;
};

export const useCreateAccount = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateAccount>>,
      Omit<CreateAccountParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateAccountParams,
    Awaited<ReturnType<typeof CreateAccount>>
  >(CreateAccount, options, {
    domain: "accounts",
    type: "create",
  });
};
