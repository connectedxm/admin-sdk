import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ROOM_TYPES_QUERY_KEY,
  EVENT_ROOM_TYPE_QUERY_KEY,
} from "@src/queries";

/**
 * Endpoint to delete a room type for a specific event and invalidate related queries.
 * This function allows the removal of a room type associated with a given event, ensuring that
 * any cached queries related to the event's room types are invalidated to maintain data consistency.
 * @name DeleteEventRoomType
 * @param {string} eventId (path) The id of the event
 * @param {string} roomTypeId (path) The id of the room type
 * @version 1.3
 **/
export interface DeleteEventRoomTypeParams extends MutationParams {
  eventId: string;
  roomTypeId: string;
}

export const DeleteEventRoomType = async ({
  eventId,
  roomTypeId,
  adminApiParams,
  queryClient,
}: DeleteEventRoomTypeParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/roomTypes/${roomTypeId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ROOM_TYPES_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_ROOM_TYPE_QUERY_KEY(eventId, roomTypeId),
    });
  }
  return data;
};

export const useDeleteEventRoomType = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventRoomType>>,
      Omit<DeleteEventRoomTypeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventRoomTypeParams,
    Awaited<ReturnType<typeof DeleteEventRoomType>>
  >(DeleteEventRoomType, options, {
    domain: "events",
    type: "update",
  });
};
