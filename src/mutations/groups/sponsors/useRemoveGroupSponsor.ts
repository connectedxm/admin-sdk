import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ConnectedXMResponse, Group } from "@src/interfaces";
import { SET_GROUP_QUERY_DATA, GROUP_SPONSORS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Groups
 */
export interface RemoveGroupSponsorParams extends MutationParams {
  groupId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Groups
 */
export const RemoveGroupSponsor = async ({
  groupId,
  accountId,
  adminApiParams,
  queryClient,
}: RemoveGroupSponsorParams): Promise<ConnectedXMResponse<Group>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<Group>>(
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

/**
 * @category Mutations
 * @group Groups
 */
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
  >(RemoveGroupSponsor, options);
};
