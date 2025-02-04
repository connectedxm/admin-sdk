import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Group } from "@src/interfaces";
import { SET_GROUP_QUERY_DATA, GROUP_SPONSORS_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to remove a sponsor from a specified group.
 * This function allows the removal of a sponsor from a group by specifying the group and account IDs.
 * It is used in scenarios where managing group sponsorships is required, ensuring that the sponsor is no longer associated with the group.
 * @name RemoveGroupSponsor
 * @param {string} groupId - The id of the group
 * @param {string} accountId - The id of the account
 * @version 1.2
 **/

export interface RemoveGroupSponsorParams extends MutationParams {
  groupId: string;
  accountId: string;
}

export const RemoveGroupSponsor = async ({
  groupId,
  accountId,
  adminApiParams,
  queryClient,
}: RemoveGroupSponsorParams): Promise<ConnectedXMResponse<Group>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<Group>>(
    `/groups/${groupId}/sponsors/${accountId}`
  );
  if (queryClient && data.status === "ok") {
    SET_GROUP_QUERY_DATA(queryClient, [groupId], data);
    queryClient.invalidateQueries({
      queryKey: GROUP_SPONSORS_QUERY_KEY(groupId),
    });
  }
  return data;
};

export const useRemoveGroupSponsor = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveGroupSponsor>>,
      Omit<RemoveGroupSponsorParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveGroupSponsorParams,
    Awaited<ReturnType<typeof RemoveGroupSponsor>>
  >(RemoveGroupSponsor, options, {
    domain: "groups",
    type: "update",
  });
};