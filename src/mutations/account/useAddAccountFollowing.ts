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
 * Endpoint to add a following relationship for a specified account.
 * This function allows an account to follow another account by specifying the account IDs.
 * It updates the account's following list and invalidates the relevant queries to ensure data consistency.
 * @name AddAccountFollowing
 * @param {string} accountId (path) - The id of the account
 * @param {string} followingId (path) - The id of the account to follow
 * @version 1.3
 **/
export interface AddAccountFollowingParams extends MutationParams {
  accountId: string;
  followingId: string;
}

export const AddAccountFollowing = async ({
  accountId,
  followingId,
  adminApiParams,
  queryClient,
}: AddAccountFollowingParams): Promise<ConnectedXMResponse<Account>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Account>>(
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

export const useAddAccountFollowing = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddAccountFollowing>>,
      Omit<AddAccountFollowingParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddAccountFollowingParams,
    Awaited<ReturnType<typeof AddAccountFollowing>>
  >(AddAccountFollowing, options, {
    domain: "accounts",
    type: "update",
  });
};