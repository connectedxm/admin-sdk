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
export interface UpdateLoginPasswordParams extends MutationParams {
  accountId: string;
  username: string;
  password: string;
}

/**
 * @category Methods
 * @group Account
 */
export const UpdateLoginPassword = async ({
  accountId,
  username,
  password,
  adminApiParams,
}: UpdateLoginPasswordParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Account>>(
    `/accounts/${accountId}/cognito/${username}/password`,
    { password }
  );

  return data;
};

/**
 * @category Mutations
 * @group Account
 */
export const useUpdateLoginPassword = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateLoginPassword>>,
      Omit<UpdateLoginPasswordParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateLoginPasswordParams,
    Awaited<ReturnType<typeof UpdateLoginPassword>>
  >(UpdateLoginPassword, options, {
    domain: "accounts",
    type: "update",
  });
};
