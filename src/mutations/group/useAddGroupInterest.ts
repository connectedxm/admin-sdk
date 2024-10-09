import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Group } from "@src/interfaces";
import { SET_GROUP_QUERY_DATA, GROUP_INTERESTS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Groups
 */
export interface AddGroupInterestParams extends MutationParams {
  groupId: string;
  interestId: string;
}

/**
 * @category Methods
 * @group Groups
 */
export const AddGroupInterest = async ({
  groupId,
  interestId,
  adminApiParams,
  queryClient,
}: AddGroupInterestParams): Promise<ConnectedXMResponse<Group>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Group>>(
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

/**
 * @category Mutations
 * @group Groups
 */
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
