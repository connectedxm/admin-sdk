import { Account, ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ACCOUNTS_QUERY_KEY, SET_ACCOUNT_QUERY_DATA } from "@src/queries";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Params
 * @group Account
 */
export interface ImpersonateAccountParams extends MutationParams {
  accountId: string;
  username: string;
}

/**
 * @category Methods
 * @group Account
 */
export const ImpersonateAccount = async ({
  accountId,
  username,
  adminApiParams,
  queryClient,
}: ImpersonateAccountParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post(
    `/accounts/${accountId}/impersonate/${username}`
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
export const useImpersonateAccount = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof ImpersonateAccount>>,
      Omit<ImpersonateAccountParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ImpersonateAccountParams,
    Awaited<ReturnType<typeof ImpersonateAccount>>
  >(ImpersonateAccount, options);
};
