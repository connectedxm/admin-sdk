import { Account, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import {
  ACCOUNT_LOGINS_QUERY_KEY,
  ACCOUNT_LOGIN_QUERY_KEY,
} from "@src/queries";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Params
 * @group Account
 */
export interface ConfirmAccountLoginParams extends MutationParams {
  accountId: string;
  username: string;
}

/**
 * @category Methods
 * @group Account
 */
export const ConfirmAccountLogin = async ({
  accountId,
  username,
  adminApiParams,
  queryClient,
}: ConfirmAccountLoginParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Account>>(
    `/accounts/${accountId}/cognito/${username}/confirm`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_LOGINS_QUERY_KEY(accountId),
    });
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_LOGIN_QUERY_KEY(accountId, username),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Account
 */
export const useConfirmAccountLogin = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ConfirmAccountLogin>>,
      Omit<ConfirmAccountLoginParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ConfirmAccountLoginParams,
    Awaited<ReturnType<typeof ConfirmAccountLogin>>
  >(ConfirmAccountLogin, options, {
    domain: "accounts",
    type: "update",
  });
};
