import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ROOMS_QUERY_KEY,
  EVENT_ROOM_QUERY_KEY,
  EVENT_ROOM_TYPES_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Rooms
 */
export interface DeleteRoomParams extends MutationParams {
  eventId: string;
  roomName: string;
}

/**
 * @category Methods
 * @group Event-Rooms
 */
export const DeleteRoom = async ({
  eventId,
  roomName,
  adminApiParams,
  queryClient,
}: DeleteRoomParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/rooms/${roomName}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ROOMS_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_ROOM_QUERY_KEY(eventId, roomName),
    });
    // Invalidate all room type rooms queries for this event
    // This will match all queries that start with EVENT_ROOM_TYPES_QUERY_KEY(eventId)
    queryClient.invalidateQueries({
      queryKey: EVENT_ROOM_TYPES_QUERY_KEY(eventId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Rooms
 */
export const useDeleteRoom = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteRoom>>,
      Omit<DeleteRoomParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteRoomParams,
    Awaited<ReturnType<typeof DeleteRoom>>
  >(DeleteRoom, options);
};
