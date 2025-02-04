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
 * @category Params
 * @group Event-Reservations
 */
export interface UpdateEventRoomTypeParams extends MutationParams {
  eventId: string;
  roomTypeId: string;
  roomType: EventRoomTypeUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Reservations
 */
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
};

/**
 * @category Mutations
 * @group Event-Reservations
 */
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
