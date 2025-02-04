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
 * @category Params
 * @group Groups
 */
export interface UpdateGroupParams extends MutationParams {
  groupId: string;
  group: GroupUpdateInputs;
}

/**
 * @category Methods
 * @group Groups
 */
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

/**
 * @category Mutations
 * @group Groups
 */
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
