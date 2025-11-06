import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Room } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { RoomUpdateInputs } from "@src/params";
import {
  EVENT_ROOMS_QUERY_KEY,
  EVENT_ROOM_QUERY_KEY,
  EVENT_ROOM_TYPES_QUERY_KEY,
  SET_EVENT_ROOM_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Rooms
 */
export interface UpdateRoomParams extends MutationParams {
  eventId: string;
  roomName: string;
  room: RoomUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Rooms
 */
export const UpdateRoom = async ({
  eventId,
  roomName,
  room,
  adminApiParams,
  queryClient,
}: UpdateRoomParams): Promise<ConnectedXMResponse<Room>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Room>>(
    `/events/${eventId}/rooms/${roomName}`,
    room
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ROOMS_QUERY_KEY(eventId),
    });
    // Update the specific room query if roomName changed
    const updatedRoomName = data.data.roomName || roomName;
    SET_EVENT_ROOM_QUERY_DATA(queryClient, [eventId, updatedRoomName], data);
    // If roomName changed, remove the old query
    if (updatedRoomName !== roomName) {
      queryClient.removeQueries({
        queryKey: EVENT_ROOM_QUERY_KEY(eventId, roomName),
      });
    }
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
export const useUpdateRoom = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateRoom>>,
      Omit<UpdateRoomParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateRoomParams,
    Awaited<ReturnType<typeof UpdateRoom>>
  >(UpdateRoom, options);
};
