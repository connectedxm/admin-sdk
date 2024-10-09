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
 * @category Params
 * @group Groups
 */
export interface CreateGroupParams extends MutationParams {
  group: GroupCreateInputs;
}

/**
 * @category Methods
 * @group Groups
 */
export const CreateGroup = async ({
  group,
  adminApiParams,
  queryClient,
}: CreateGroupParams): Promise<ConnectedXMResponse<Group>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Group>>(
    `/groups`,
    group
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEY() });
    SET_GROUP_QUERY_DATA(queryClient, [data.data?.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Groups
 */
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
