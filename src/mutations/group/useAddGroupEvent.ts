import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Group } from "@src/interfaces";
import { SET_GROUP_QUERY_DATA, GROUP_EVENTS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Groups
 */
export interface AddGroupEventParams extends MutationParams {
  groupId: string;
  eventId: string;
}

/**
 * @category Methods
 * @group Groups
 */
export const AddGroupEvent = async ({
  groupId,
  eventId,
  adminApiParams,
  queryClient,
}: AddGroupEventParams): Promise<ConnectedXMResponse<Group>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Group>>(
    `/groups/${groupId}/events/${eventId}`
  );
  if (queryClient && data.status === "ok") {
    SET_GROUP_QUERY_DATA(queryClient, [groupId], data);
    queryClient.invalidateQueries({
      queryKey: GROUP_EVENTS_QUERY_KEY(groupId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Groups
 */
export const useAddGroupEvent = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddGroupEvent>>,
      Omit<AddGroupEventParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddGroupEventParams,
    Awaited<ReturnType<typeof AddGroupEvent>>
  >(AddGroupEvent, options);
};
