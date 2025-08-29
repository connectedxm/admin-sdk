import { Login, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { LOGINS_QUERY_KEY, LOGIN_QUERY_KEY } from "@src/queries";
import { GetAdminAPI } from "@src/AdminAPI";
/**
 * @category Params
 * @group Logins
 */
export interface UpdateLoginPasswordParams extends MutationParams {
  username: string;
  password: string;
}

/**
 * @category Methods
 * @group Logins
 */
export const UpdateLoginPassword = async ({
  username,
  password,
  adminApiParams,
  queryClient,
}: UpdateLoginPasswordParams): Promise<ConnectedXMResponse<Login>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Login>>(
    `/logins/${username}/password`,
    { password }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: LOGINS_QUERY_KEY(),
    });
    queryClient.invalidateQueries({
      queryKey: LOGIN_QUERY_KEY(username),
    });
  }
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
