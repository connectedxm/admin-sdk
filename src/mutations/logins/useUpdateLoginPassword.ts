import { Login, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
/**
 * @category Params
 * @group Logins
 */
export interface UpdateLoginPasswordParams extends MutationParams {
  sub: string;
  password: string;
}

/**
 * @category Methods
 * @group Logins
 */
export const UpdateLoginPassword = async ({
  sub,
  password,
  adminApiParams,
}: UpdateLoginPasswordParams): Promise<ConnectedXMResponse<Login>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Login>>(
    `/logins/${sub}/password`,
    { password }
  );

  return data;
};

/**
 * @category Mutations
 * @group Logins
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
