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
 * Endpoint to remove a follower from a specified account.
 * This function allows the removal of a follower from an account by specifying the account ID and the follower ID.
 * It is designed to be used in applications where managing account followers is necessary.
 * @name RemoveAccountFollower
 * @param {string} accountId (path) - The id of the account
 * @param {string} followerId (path) - The id of the follower to be removed
 * @version 1.3
 **/
export interface RemoveAccountFollowerParams extends MutationParams {
  accountId: string;
  followerId: string;
}

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