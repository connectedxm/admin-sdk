import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Endpoint to impersonate a user account by providing the account ID and username.
 * This function allows an admin to act on behalf of a user by impersonating their account, 
 * which can be useful for troubleshooting or managing user-specific settings.
 * @name ImpersonateAccount
 * @param {string} accountId (path) - The ID of the account to impersonate
 * @param {string} username (path) - The username associated with the account
 * @version 1.3
 **/

export interface ImpersonateAccountParams extends MutationParams {
  accountId: string;
  username: string;
}

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