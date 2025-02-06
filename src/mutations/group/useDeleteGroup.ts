import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { GROUPS_QUERY_KEY, GROUP_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete a group by its unique identifier.
 * This function allows for the removal of a group from the system, ensuring that all associated queries are invalidated and removed.
 * It is designed to be used in applications where group management and cleanup are necessary.
 * @name DeleteGroup
 * @param {string} groupId (path) - The id of the group to be deleted
 * @version 1.3
 **/

export interface DeleteGroupParams extends MutationParams {
  groupId: string;
}

export const DeleteGroup = async ({
  groupId,
  adminApiParams,
  queryClient,
}: DeleteGroupParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/groups/${groupId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: GROUP_QUERY_KEY(groupId) });
  }
  return data;
};

export const useDeleteGroup = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteGroup>>,
      Omit<DeleteGroupParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteGroupParams,
    Awaited<ReturnType<typeof DeleteGroup>>
  >(DeleteGroup, options, {
    domain: "groups",
    type: "del",
  });
};