import { Account, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  ACCOUNT_FOLLOWING_QUERY_KEY,
  SET_ACCOUNT_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to remove a following relationship for a specified account.
 * This function allows the removal of a following relationship between two accounts by specifying their IDs.
 * It is used in scenarios where an account needs to unfollow another account.
 * @name RemoveAccountFollowing
 * @param {string} accountId (path) The id of the account
 * @param {string} followingId (path) The id of the following account
 * @version 1.3
 **/
export interface RemoveAccountFollowingParams extends MutationParams {
  accountId: string;
  followingId: string;
}

export const RemoveAccountFollowing = async ({
  accountId,
  followingId,
  adminApiParams,
  queryClient,
}: RemoveAccountFollowingParams): Promise<ConnectedXMResponse<Account>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<Account>>(
    `/accounts/${accountId}/following/${followingId}`
  );

  if (queryClient && data.status === "ok") {
    SET_ACCOUNT_QUERY_DATA(queryClient, [accountId], data);
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_FOLLOWING_QUERY_KEY(accountId),
    });
  }
  return data;
};

export const useRemoveAccountFollowing = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveAccountFollowing>>,
      Omit<RemoveAccountFollowingParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveAccountFollowingParams,
    Awaited<ReturnType<typeof RemoveAccountFollowing>>
  >(RemoveAccountFollowing, options, {
    domain: "accounts",
    type: "update",
  });
};
