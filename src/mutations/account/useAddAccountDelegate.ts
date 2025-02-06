import { Account, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  ACCOUNT_DELEGATE_OF_QUERY_KEY,
  ACCOUNT_DELEGATES_QUERY_KEY,
  SET_ACCOUNT_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to add a delegate to an account.
 * This function allows the addition of a delegate to a specified account by providing the account and delegate IDs.
 * It is used in scenarios where account management requires delegation capabilities.
 * @name AddAccountDelegate
 * @param {string} accountId (path) - The id of the account
 * @param {string} delegateId (path) - The id of the delegate
 * @version 1.3
 **/
export interface AddAccountDelegateParams extends MutationParams {
  accountId: string;
  delegateId: string;
}

export const AddAccountDelegate = async ({
  accountId,
  delegateId,
  adminApiParams,
  queryClient,
}: AddAccountDelegateParams): Promise<ConnectedXMResponse<Account>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Account>>(
    `/accounts/${accountId}/delegates/${delegateId}`
  );

  if (queryClient && data.status === "ok") {
    SET_ACCOUNT_QUERY_DATA(queryClient, [accountId], data);
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_DELEGATES_QUERY_KEY(accountId),
    });
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_DELEGATE_OF_QUERY_KEY(delegateId),
    });
  }
  return data;
}

export const useAddAccountDelegate = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddAccountDelegate>>,
      Omit<AddAccountDelegateParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddAccountDelegateParams,
    Awaited<ReturnType<typeof AddAccountDelegate>>
  >(AddAccountDelegate, options, {
    domain: "accounts",
    type: "update",
  });
};