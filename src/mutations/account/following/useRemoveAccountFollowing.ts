import { Account, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  ACCOUNT_FOLLOWING_QUERY_KEY,
  SET_ACCOUNT_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Account
 */
export interface RemoveAccountFollowingParams extends MutationParams {
  accountId: string;
  followingId: string;
}

/**
 * @category Methods
 * @group Account
 */
export const RemoveAccountFollowing = async ({
  accountId,
  followingId,
  adminApiParams,
  queryClient,
}: RemoveAccountFollowingParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<Account>>(
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

/**
 * @category Mutations
 * @group Account
 */
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
  >(RemoveAccountFollowing, options);
};
