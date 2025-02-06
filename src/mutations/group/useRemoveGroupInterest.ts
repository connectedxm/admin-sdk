import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Group } from "@src/interfaces";
import { SET_GROUP_QUERY_DATA, GROUP_INTERESTS_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to remove an interest from a group.
 * This function allows the removal of a specific interest associated with a group by providing the group ID and account ID.
 * It is designed to be used in applications where managing group interests is required.
 * @name RemoveGroupInterest
 * @param {string} groupId (path) The id of the group
 * @param {string} accountId (path) The id of the account
 * @version 1.3
 **/

export interface RemoveGroupInterestParams extends MutationParams {
  groupId: string;
  accountId: string;
}

export const RemoveGroupInterest = async ({
  groupId,
  accountId,
  adminApiParams,
  queryClient,
}: RemoveGroupInterestParams): Promise<ConnectedXMResponse<Group>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<Group>>(
    `/groups/${groupId}/interests/${accountId}`
  );
  if (queryClient && data.status === "ok") {
    SET_GROUP_QUERY_DATA(queryClient, [groupId], data);
    queryClient.invalidateQueries({
      queryKey: GROUP_INTERESTS_QUERY_KEY(groupId),
    });
  }
  return data;
};

export const useRemoveGroupInterest = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveGroupInterest>>,
      Omit<RemoveGroupInterestParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveGroupInterestParams,
    Awaited<ReturnType<typeof RemoveGroupInterest>>
  >(RemoveGroupInterest, options, {
    domain: "groups",
    type: "update",
  });
};
