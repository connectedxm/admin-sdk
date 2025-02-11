import { GetAdminAPI } from "@src/AdminAPI";
import { Group, ConnectedXMResponse } from "@src/interfaces";
import { GROUPS_QUERY_KEY, SET_GROUP_QUERY_DATA } from "@src/queries";
import {
  MutationParams,
  ConnectedXMMutationOptions,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GroupCreateInputs } from "@src/params";

/**
 * Creates a new group within the system using the specified parameters.
 * This function is designed to facilitate the creation of groups by accepting necessary input parameters and interacting with the backend API.
 * It ensures that the group is created and updates the query cache accordingly if the operation is successful.
 * @name PostGroups
 * @param {GroupCreateInputs} group (body) The inputs required to create a group
 * @version 1.3
 **/
export interface CreateGroupParams extends MutationParams {
  group: GroupCreateInputs;
}

export const CreateGroup = async ({
  group,
  adminApiParams,
  queryClient,
}: CreateGroupParams): Promise<ConnectedXMResponse<Group>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Group>>(
    `/groups`,
    group
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEY() });
    SET_GROUP_QUERY_DATA(queryClient, [data.data?.id], data);
  }
  return data;
};

export const useCreateGroup = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateGroup>>,
      Omit<CreateGroupParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateGroupParams,
    Awaited<ReturnType<typeof CreateGroup>>
  >(CreateGroup, options, {
    domain: "groups",
    type: "create",
  });
};

export default useCreateGroup;
