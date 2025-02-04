import { Account, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import {
  ACCOUNT_FOLLOWERS_QUERY_KEY,
  SET_ACCOUNT_QUERY_DATA,
} from "@src/queries";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Params
 * @group Account
 */
export interface RemoveAccountFollowerParams extends MutationParams {
  accountId: string;
  followerId: string;
}

/**
 * @category Methods
 * @group Account
 */
export const RemoveAccountFollower = async ({
  accountId,
  followerId,
  adminApiParams,
  queryClient,
}: RemoveAccountFollowerParams): Promise<ConnectedXMResponse<Account>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<Account>>(
    `/accounts/${accountId}/followers/${followerId}`
  );

  if (queryClient && data.status === "ok") {
    SET_ACCOUNT_QUERY_DATA(queryClient, [accountId], data);
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_FOLLOWERS_QUERY_KEY(accountId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Account
 */
export const useRemoveAccountFollower = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveAccountFollower>>,
      Omit<RemoveAccountFollowerParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveAccountFollowerParams,
    Awaited<ReturnType<typeof RemoveAccountFollower>>
  >(RemoveAccountFollower, options, {
    domain: "accounts",
    type: "update",
  });
};
