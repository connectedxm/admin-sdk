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
export interface ConfirmLoginParams extends MutationParams {
  username: string;
}

/**
 * @category Methods
 * @group Logins
 */
export const ConfirmLogin = async ({
  username,
  adminApiParams,
  queryClient,
}: ConfirmLoginParams): Promise<ConnectedXMResponse<Login>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Login>>(
    `/logins/${username}/confirm`
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
export const useConfirmLogin = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ConfirmLogin>>,
      Omit<ConfirmLoginParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ConfirmLoginParams,
    Awaited<ReturnType<typeof ConfirmLogin>>
  >(ConfirmLogin, options, {
    domain: "accounts",
    type: "update",
  });
};
