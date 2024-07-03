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
 * @category Params
 * @group Account
 */
export interface CreateAccountParams extends MutationParams {
  account: AccountCreateInputs;
}

/**
 * @category Methods
 * @group Account
 */
export const CreateAccount = async ({
  account,
  adminApiParams,
  queryClient,
}: CreateAccountParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Account>>(
    `/accounts`,
    account
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY() });
    SET_ACCOUNT_QUERY_DATA(queryClient, [data?.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Account
 */
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
  >(CreateAccount, options);
};
