import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ConnectedXMResponse, Group } from "@src/interfaces";
import {
  SET_GROUP_QUERY_DATA,
  GROUP_MEMBERS_QUERY_KEY,
  GROUP_MODERATORS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Groups
 */
export interface RemoveAllGroupMembersParams extends MutationParams {
  groupId: string;
}

/**
 * @category Methods
 * @group Groups
 */
export const RemoveAllGroupMembers = async ({
  groupId,
  adminApiParams,
  queryClient,
}: RemoveAllGroupMembersParams): Promise<ConnectedXMResponse<Group>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<Group>>(
    `/groups/${groupId}/members`
  );
  if (queryClient && data.status === "ok") {
    SET_GROUP_QUERY_DATA(queryClient, [groupId], data);
    queryClient.invalidateQueries({
      queryKey: GROUP_MEMBERS_QUERY_KEY(groupId),
    });
    queryClient.invalidateQueries({
      queryKey: GROUP_MODERATORS_QUERY_KEY(groupId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Groups
 */
export const useRemoveAllGroupMembers = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveAllGroupMembers>>,
      Omit<RemoveAllGroupMembersParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveAllGroupMembersParams,
    Awaited<ReturnType<typeof RemoveAllGroupMembers>>
  >(RemoveAllGroupMembers, options);
};

