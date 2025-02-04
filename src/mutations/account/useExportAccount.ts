import { Account, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Params
 * @group Account
 */
export interface ExportAccountParams extends MutationParams {
  accountId: string;
}

/**
 * @category Methods
 * @group Account
 */
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

/**
 * @category Mutations
 * @group Account
 */
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
