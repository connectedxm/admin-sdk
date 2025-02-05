import { Account, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Endpoint to export data for a specific account.
 * This function allows users to export detailed information about an account using the provided account ID.
 * It is designed to be used in applications where exporting account data is necessary.
 * @name ExportAccount
 * @param {string} accountId - The id of the account
 * @version 1.2
 **/

export interface ExportAccountParams extends MutationParams {
  accountId: string;
}

export const ExportAccount = async ({
  accountId,
  adminApiParams,
}: ExportAccountParams): Promise<ConnectedXMResponse<Account>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Account>>(
    `/accounts/${accountId}/export`
  );

  return data;
};

export const useExportAccount = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ExportAccount>>,
      Omit<ExportAccountParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ExportAccountParams,
    Awaited<ReturnType<typeof ExportAccount>>
  >(ExportAccount, options, {
    domain: "accounts",
    type: "read",
  });
};