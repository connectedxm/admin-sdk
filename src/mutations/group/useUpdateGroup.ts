import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { Group, ConnectedXMResponse } from "@src/interfaces";
import { GROUPS_QUERY_KEY, SET_GROUP_QUERY_DATA } from "@src/queries";
import { GroupUpdateInputs } from "@src/params";

/**
 * Endpoint to update the data of a specific group.
 * This function allows for updating a group's information by providing the group ID and the new data.
 * It is designed to be used in applications where group data management is required.
 * @name UpdateGroup
 * @param {string} groupId - The ID of the group
 * @param {GroupUpdateInputs} group - The data to update the group with
 * @version 1.2
 **/
export interface UpdateGroupParams extends MutationParams {
  groupId: string;
  group: GroupUpdateInputs;
}

export const UpdateGroup = async ({
  groupId,
  group,
  adminApiParams,
  queryClient,
}: UpdateGroupParams): Promise<ConnectedXMResponse<Group>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<Group>>(
    `/groups/${groupId}`,
    group
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEY() });
    SET_GROUP_QUERY_DATA(queryClient, [groupId], data);
  }
  return data;
};

export const useUpdateGroup = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateGroup>>,
      Omit<UpdateGroupParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateGroupParams,
    Awaited<ReturnType<typeof UpdateGroup>>
  >(UpdateGroup, options, {
    domain: "groups",
    type: "update",
  });
};