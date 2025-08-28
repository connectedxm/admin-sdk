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
export interface AddLoginAccountParams extends MutationParams {
  username: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Logins
 */
export const AddLoginAccount = async ({
  username,
  accountId,
  adminApiParams,
  queryClient,
}: AddLoginAccountParams): Promise<ConnectedXMResponse<Login>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Login>>(
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
export const useAddLoginAccount = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddLoginAccount>>,
      Omit<AddLoginAccountParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddLoginAccountParams,
    Awaited<ReturnType<typeof AddLoginAccount>>
  >(AddLoginAccount, options, {
    domain: "accounts",
    type: "update",
  });
};
