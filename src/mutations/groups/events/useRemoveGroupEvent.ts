import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse, Group } from "@src/interfaces";
import { SET_GROUP_QUERY_DATA, GROUP_EVENTS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Groups
 */
export interface RemoveGroupEventParams extends MutationParams {
  groupId: string;
  eventId: string;
}

/**
 * @category Methods
 * @group Groups
 */
export const RemoveGroupEvent = async ({
  groupId,
  eventId,
  adminApiParams,
  queryClient,
}: RemoveGroupEventParams): Promise<ConnectedXMResponse<Group>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<Group>>(
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
  >(RemoveGroupEvent, options);
};
