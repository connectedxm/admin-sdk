import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ACCOUNT_GROUPS_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to remove a group from an account.
 * This function allows the removal of a specified group from a given account by utilizing the account and group identifiers.
 * It is designed to be used in scenarios where account group management is required, ensuring that the specified group is detached from the account.
 * @name RemoveAccountGroup
 * @param {string} accountId (path) The id of the account
 * @param {string} groupId (path) The id of the group
 * @version 1.3
 **/
export interface RemoveAccountGroupParams extends MutationParams {
  accountId: string;
  groupId: string;
}

export const RemoveAccountGroup = async ({
  accountId,
  groupId,
  adminApiParams,
  queryClient,
}: RemoveAccountGroupParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/accounts/${accountId}/groups/${groupId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_GROUPS_QUERY_KEY(accountId),
    });
  }
  return data;
};

export const useRemoveAccountGroup = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveAccountGroup>>,
      Omit<RemoveAccountGroupParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveAccountGroupParams,
    Awaited<ReturnType<typeof RemoveAccountGroup>>
  >(RemoveAccountGroup, options, {
    domain: "accounts",
    type: "update",
  });
};
