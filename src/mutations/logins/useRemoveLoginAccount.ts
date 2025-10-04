import { Login, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { LOGIN_QUERY_KEY, LOGIN_ACCOUNTS_QUERY_KEY } from "@src/queries";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Params
 * @group Logins
 */
export interface RemoveLoginAccountParams extends MutationParams {
  username: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Logins
 */
export const RemoveLoginAccount = async ({
  username,
  accountId,
  adminApiParams,
  queryClient,
}: RemoveLoginAccountParams): Promise<ConnectedXMResponse<Login>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<Login>>(
    `/logins/${username}/accounts/${accountId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: LOGIN_QUERY_KEY(username),
    });
    queryClient.invalidateQueries({
      queryKey: LOGIN_ACCOUNTS_QUERY_KEY(username),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Logins
 */
export const useRemoveLoginAccount = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveLoginAccount>>,
      Omit<RemoveLoginAccountParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveLoginAccountParams,
    Awaited<ReturnType<typeof RemoveLoginAccount>>
  >(RemoveLoginAccount, options);
};
