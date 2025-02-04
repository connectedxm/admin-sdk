import { ConnectedXMResponse } from "@src/interfaces";
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
}: ImpersonateAccountParams): Promise<ConnectedXMResponse<string>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<string>>(
    `/accounts/${accountId}/impersonate/${username}`
  );

  return data;
};

/**
 * @category Mutations
 * @group Account
 */
export const useImpersonateAccount = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ImpersonateAccount>>,
      Omit<ImpersonateAccountParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ImpersonateAccountParams,
    Awaited<ReturnType<typeof ImpersonateAccount>>
  >(ImpersonateAccount, options, {
    domain: "accounts",
    type: "update",
  });
};
