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
export interface UpdateLoginEmailParams extends MutationParams {
  accountId: string;
  username: string;
  email: string;
}

/**
 * @category Methods
 * @group Account
 */
export const UpdateLoginEmail = async ({
  accountId,
  username,
  email,
  adminApiParams,
}: UpdateLoginEmailParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Account>>(
    `/accounts/${accountId}/cognito/${username}/email`,
    { email }
  );

  return data;
};

/**
 * @category Mutations
 * @group Account
 */
export const useUpdateLoginEmail = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateLoginEmail>>,
      Omit<UpdateLoginEmailParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateLoginEmailParams,
    Awaited<ReturnType<typeof UpdateLoginEmail>>
  >(UpdateLoginEmail, options, {
    domain: "accounts",
    type: "update",
  });
};
