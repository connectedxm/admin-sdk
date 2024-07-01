import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { GROUPS_QUERY_KEY, GROUP_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Groups
 */
export interface DeleteGroupParams extends MutationParams {
  groupId: string;
}

/**
 * @category Methods
 * @group Groups
 */
export const DeleteGroup = async ({
  groupId,
  adminApiParams,
  queryClient,
}: DeleteGroupParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/groups/${groupId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: GROUP_QUERY_KEY(groupId) });
  }
  return data;
};

/**
 * @category Mutations
 * @group Groups
 */
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
  >(DeleteGroup, options);
};
