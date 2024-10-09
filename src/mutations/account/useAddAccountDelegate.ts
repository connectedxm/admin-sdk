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
export interface AddAccountDelegateParams extends MutationParams {
  accountId: string;
  delegateId: string;
}

/**
 * @category Methods
 * @group Account
 */
export const AddAccountDelegate = async ({
  accountId,
  delegateId,
  adminApiParams,
  queryClient,
}: AddAccountDelegateParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Account>>(
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
