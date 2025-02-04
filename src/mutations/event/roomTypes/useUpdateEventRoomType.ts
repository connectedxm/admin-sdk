import { GetAdminAPI } from "@src/AdminAPI";
import { EventRoomType, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventRoomTypeUpdateInputs } from "@src/params";
import {
  EVENT_ROOM_TYPES_QUERY_KEY,
  SET_EVENT_ROOM_TYPE_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to update the room type for a specific event.
 * This function allows updating the details of a room type associated with a particular event.
 * It is designed to be used in scenarios where modifications to event room types are necessary.
 * @name UpdateEventRoomType
 * @param {string} eventId - The id of the event
 * @param {string} roomTypeId - The id of the room type
 * @param {EventRoomTypeUpdateInputs} roomType - The room type update inputs
 * @version 1.2
 **/

export interface UpdateEventRoomTypeParams extends MutationParams {
  eventId: string;
  roomTypeId: string;
  roomType: EventRoomTypeUpdateInputs;
}

export const UpdateEventRoomType = async ({
  eventId,
  roomTypeId,
  roomType,
  adminApiParams,
  queryClient,
}: UpdateEventRoomTypeParams): Promise<ConnectedXMResponse<EventRoomType>> => {
  if (!roomTypeId) throw new Error("Room Type ID Undefined");
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<EventRoomType>>(
    `/events/${eventId}/roomTypes/${roomTypeId}`,
    {
      ...roomType,
      id: undefined,
      event: undefined,
      eventId: undefined,
      allowedTickets: undefined,
      allowedTiers: undefined,
      _count: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      image: undefined,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ROOM_TYPES_QUERY_KEY(eventId),
    });
    SET_EVENT_ROOM_TYPE_QUERY_DATA(
      queryClient,
      [eventId, roomTypeId || data.data?.id],
      data
    );
  }
  return data;
}

export const useUpdateEventRoomType = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventRoomType>>,
      Omit<UpdateEventRoomTypeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventRoomTypeParams,
    Awaited<ReturnType<typeof UpdateEventRoomType>>
  >(UpdateEventRoomType, options, {
    domain: "events",
    type: "update",
  });
};