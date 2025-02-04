import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Group } from "@src/interfaces";
import { SET_GROUP_QUERY_DATA, GROUP_EVENTS_QUERY_KEY } from "@src/queries";

/**
 * Adds an event to a specified group and updates the query client with the new data.
 * This function is used to associate an event with a group, ensuring that the group data is updated accordingly.
 * It is particularly useful in scenarios where group-event relationships need to be dynamically managed.
 * @name AddGroupEvent
 * @param {string} groupId - The id of the group
 * @param {string} eventId - The id of the event
 * @version 1.2
 **/

export interface AddGroupEventParams extends MutationParams {
  groupId: string;
  eventId: string;
}

export const AddGroupEvent = async ({
  groupId,
  eventId,
  adminApiParams,
  queryClient,
}: AddGroupEventParams): Promise<ConnectedXMResponse<Group>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Group>>(
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
  >(AddGroupEvent, options, {
    domain: "groups",
    type: "update",
  });
};