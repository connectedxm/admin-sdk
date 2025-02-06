import { GetAdminAPI } from "@src/AdminAPI";
import { Account, ConnectedXMResponse } from "@src/interfaces";
import {
  ACCOUNT_FOLLOWERS_QUERY_KEY,
  SET_ACCOUNT_QUERY_DATA,
} from "@src/queries";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";

/**
 * Adds a follower to a specified account.
 * This function allows the addition of a follower to an account by specifying the account and follower IDs.
 * It is used in scenarios where account follower management is required, ensuring that the follower is added to the account's follower list.
 * @name AddAccountFollower
 * @param {string} accountId (path) - The id of the account
 * @param {string} followerId (path) - The id of the follower
 * @version 1.3
 **/

export interface AddAccountFollowerParams extends MutationParams {
  accountId: string;
  followerId: string;
}

export const AddAccountFollower = async ({
  accountId,
  followerId,
  adminApiParams,
  queryClient,
}: AddAccountFollowerParams): Promise<ConnectedXMResponse<Account>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Account>>(
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

export const useAddAccountFollower = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddAccountFollower>>,
      Omit<AddAccountFollowerParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddAccountFollowerParams,
    Awaited<ReturnType<typeof AddAccountFollower>>
  >(AddAccountFollower, options, {
    domain: "accounts",
    type: "update",
  });
};