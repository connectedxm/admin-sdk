import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Group } from "@src/interfaces";
import { SET_GROUP_QUERY_DATA, GROUP_SPONSORS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Groups
 */
export interface AddGroupSponsorParams extends MutationParams {
  groupId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Groups
 */
export const AddGroupSponsor = async ({
  groupId,
  accountId,
  adminApiParams,
  queryClient,
}: AddGroupSponsorParams): Promise<ConnectedXMResponse<Group>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Group>>(
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
export const useAddGroupSponsor = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddGroupSponsor>>,
      Omit<AddGroupSponsorParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddGroupSponsorParams,
    Awaited<ReturnType<typeof AddGroupSponsor>>
  >(AddGroupSponsor, options, {
    domain: "groups",
    type: "update",
  });
};
