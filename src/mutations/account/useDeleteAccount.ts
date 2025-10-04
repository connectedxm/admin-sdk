import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ACCOUNTS_QUERY_KEY, ACCOUNT_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Account
 */
export interface DeleteAccountParams extends MutationParams {
  accountId: string;
}

/**
 * @category Methods
 * @group Account
 */
export const DeleteAccount = async ({
  accountId,
  adminApiParams,
  queryClient,
}: DeleteAccountParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/accounts/${accountId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: ACCOUNT_QUERY_KEY(accountId) });
  }
  return data;
};

/**
 * @category Mutations
 * @group Account
 */
export const useDeleteAccount = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteAccount>>,
      Omit<DeleteAccountParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteAccountParams,
    Awaited<ReturnType<typeof DeleteAccount>>
  >(DeleteAccount, options);
};
