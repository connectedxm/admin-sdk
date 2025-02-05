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
 * Endpoint to remove a delegate from an account.
 * This function allows the removal of a delegate associated with a specific account by their unique identifiers.
 * It is designed to be used in applications where account management and delegate permissions are required.
 * @name RemoveAccountDelegate
 * @param {string} accountId - The id of the account
 * @param {string} delegateId - The id of the delegate
 * @version 1.2
 **/
export interface RemoveAccountDelegateParams extends MutationParams {
  accountId: string;
  delegateId: string;
}

export const RemoveAccountDelegate = async ({
  accountId,
  delegateId,
  adminApiParams,
  queryClient,
}: RemoveAccountDelegateParams): Promise<ConnectedXMResponse<Account>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<Account>>(
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
};

export const useRemoveAccountDelegate = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveAccountDelegate>>,
      Omit<RemoveAccountDelegateParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveAccountDelegateParams,
    Awaited<ReturnType<typeof RemoveAccountDelegate>>
  >(RemoveAccountDelegate, options, {
    domain: "accounts",
    type: "update",
  });
};
