import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Group } from "@src/interfaces";
import { SET_GROUP_QUERY_DATA, GROUP_EVENTS_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to remove a specific event from a group.
 * This function allows the removal of an event from a specified group by providing the group and event identifiers.
 * It is designed to be used in applications where managing group events is necessary.
 * @name RemoveGroupEvent
 * @param {string} groupId (path) - The id of the group
 * @param {string} eventId (path) - The id of the event
 * @version 1.3
 **/

export interface RemoveGroupEventParams extends MutationParams {
  groupId: string;
  eventId: string;
}

export const RemoveGroupEvent = async ({
  groupId,
  eventId,
  adminApiParams,
  queryClient,
}: RemoveGroupEventParams): Promise<ConnectedXMResponse<Group>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<Group>>(
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

export const useRemoveGroupEvent = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveGroupEvent>>,
      Omit<RemoveGroupEventParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveGroupEventParams,
    Awaited<ReturnType<typeof RemoveGroupEvent>>
  >(RemoveGroupEvent, options, {
    domain: "groups",
    type: "update",
  });
};