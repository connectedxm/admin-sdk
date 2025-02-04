import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Group } from "@src/interfaces";
import { SET_GROUP_QUERY_DATA, GROUP_SPONSORS_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to add a sponsor to a specific group.
 * This function allows the addition of a sponsor to a group by specifying the group and account IDs.
 * It is used in scenarios where a group needs to be associated with a new sponsor.
 * @name AddGroupSponsor
 * @param {string} groupId - The id of the group
 * @param {string} accountId - The id of the account
 * @version 1.2
 **/
export interface AddGroupSponsorParams extends MutationParams {
  groupId: string;
  accountId: string;
}

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