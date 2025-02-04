import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ACCOUNTS_QUERY_KEY, ACCOUNT_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete a specific account by its unique identifier.
 * This function allows for the removal of an account from the system, ensuring that all associated queries are invalidated.
 * It is designed to be used in applications where account management and cleanup are necessary.
 * @name DeleteAccount
 * @param {string} accountId - The id of the account
 * @version 1.2
 **/
export interface DeleteAccountParams extends MutationParams {
  accountId: string;
}

export const DeleteAccount = async ({
  accountId,
  adminApiParams,
  queryClient,
}: DeleteAccountParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/accounts/${accountId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: ACCOUNT_QUERY_KEY(accountId) });
  }
  return data;
};

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
  >(DeleteAccount, options, {
    domain: "accounts",
    type: "del",
  });
};