import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Group } from "@src/interfaces";
import { SET_GROUP_QUERY_DATA, GROUP_INTERESTS_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to add an interest to a specific group.
 * This function allows users to associate a new interest with a group by providing the group's ID and the interest's ID.
 * It is designed to update the group's interests and ensure the data is consistent across the application.
 * @name AddGroupInterest
 * @param {string} groupId (path) - The id of the group
 * @param {string} interestId (path) - The id of the interest
 * @version 1.3
 **/

export interface AddGroupInterestParams extends MutationParams {
  groupId: string;
  interestId: string;
}

export const AddGroupInterest = async ({
  groupId,
  interestId,
  adminApiParams,
  queryClient,
}: AddGroupInterestParams): Promise<ConnectedXMResponse<Group>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Group>>(
    `/groups/${groupId}/interests/${interestId}`
  );
  if (queryClient && data.status === "ok") {
    SET_GROUP_QUERY_DATA(queryClient, [groupId], data);
    queryClient.invalidateQueries({
      queryKey: GROUP_INTERESTS_QUERY_KEY(groupId),
    });
  }
  return data;
};

export const useAddGroupInterest = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddGroupInterest>>,
      Omit<AddGroupInterestParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddGroupInterestParams,
    Awaited<ReturnType<typeof AddGroupInterest>>
  >(AddGroupInterest, options, {
    domain: "groups",
    type: "update",
  });
};