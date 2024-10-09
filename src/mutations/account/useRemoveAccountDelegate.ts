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
 * @category Params
 * @group Account
 */
export interface RemoveAccountDelegateParams extends MutationParams {
  accountId: string;
  delegateId: string;
}

/**
 * @category Methods
 * @group Account
 */
export const RemoveAccountDelegate = async ({
  accountId,
  delegateId,
  adminApiParams,
  queryClient,
}: RemoveAccountDelegateParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<Account>>(
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

/**
 * @category Mutations
 * @group Account
 */
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
