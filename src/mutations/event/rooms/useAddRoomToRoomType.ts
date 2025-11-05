import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventRoomType } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ROOM_TYPE_ROOMS_QUERY_KEY,
  EVENT_ROOMS_QUERY_KEY,
  SET_EVENT_ROOM_TYPE_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Rooms
 */
export interface AddRoomToRoomTypeParams extends MutationParams {
  eventId: string;
  roomTypeId: string;
  roomId: string;
}

/**
 * @category Methods
 * @group Event-Rooms
 */
export const AddRoomToRoomType = async ({
  eventId,
  roomTypeId,
  roomId,
  adminApiParams,
  queryClient,
}: AddRoomToRoomTypeParams): Promise<ConnectedXMResponse<EventRoomType>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventRoomType>>(
    `/events/${eventId}/roomTypes/${roomTypeId}/rooms/${roomId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ROOM_TYPE_ROOMS_QUERY_KEY(eventId, roomTypeId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ROOMS_QUERY_KEY(eventId),
    });
    SET_EVENT_ROOM_TYPE_QUERY_DATA(queryClient, [eventId, roomTypeId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Rooms
 */
export const useAddRoomToRoomType = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddRoomToRoomType>>,
      Omit<AddRoomToRoomTypeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddRoomToRoomTypeParams,
    Awaited<ReturnType<typeof AddRoomToRoomType>>
  >(AddRoomToRoomType, options);
};
