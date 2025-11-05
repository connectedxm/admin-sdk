import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Room } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { RoomCreateInputs } from "@src/params";
import { EVENT_ROOMS_QUERY_KEY, SET_EVENT_ROOM_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group Event-Rooms
 */
export interface CreateRoomParams extends MutationParams {
  eventId: string;
  room: RoomCreateInputs;
}

/**
 * @category Methods
 * @group Event-Rooms
 */
export const CreateRoom = async ({
  eventId,
  room,
  adminApiParams,
  queryClient,
}: CreateRoomParams): Promise<ConnectedXMResponse<Room>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Room>>(
    `/events/${eventId}/rooms`,
    room
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ROOMS_QUERY_KEY(eventId),
    });
    SET_EVENT_ROOM_QUERY_DATA(queryClient, [eventId, data.data.roomName], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Rooms
 */
export const useCreateRoom = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateRoom>>,
      Omit<CreateRoomParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateRoomParams,
    Awaited<ReturnType<typeof CreateRoom>>
  >(CreateRoom, options);
};
