import { ConnectedXMResponse, GroupMembership } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ACCOUNT_GROUPS_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to add a group to an account and invalidate related queries.
 * This function allows the addition of a specified group to a given account, ensuring that any related cached queries are invalidated to maintain data consistency.
 * It is designed for use in applications where account group management is required.
 * @name AddAccountGroup
 * @param {string} accountId (path) The id of the account
 * @param {string} groupId (path) The id of the group
 * @version 1.3
 **/
export interface AddAccountGroupParams extends MutationParams {
  accountId: string;
  groupId: string;
}

export const AddAccountGroup = async ({
  accountId,
  groupId,
  adminApiParams,
  queryClient,
}: AddAccountGroupParams): Promise<ConnectedXMResponse<GroupMembership>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<GroupMembership>>(
    `/accounts/${accountId}/groups/${groupId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_GROUPS_QUERY_KEY(accountId),
    });
  }
  return data;
};

export const useAddAccountGroup = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddAccountGroup>>,
      Omit<AddAccountGroupParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddAccountGroupParams,
    Awaited<ReturnType<typeof AddAccountGroup>>
  >(AddAccountGroup, options, {
    domain: "accounts",
    type: "update",
  });
};
