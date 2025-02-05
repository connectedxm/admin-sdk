import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventRoomType } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventRoomTypeAddOnDetailsUpdateInputs } from "@src/params";
import {
  EVENT_ROOM_TYPE_QUERY_KEY,
  SET_EVENT_ROOM_TYPE_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to update the details of a specific add-on for a room type in an event.
 * This function allows updating the details of an add-on associated with a room type within a specific event.
 * It is designed to be used in scenarios where modifications to add-on details are required for event room types.
 * @name UpdateEventRoomTypeAddOnDetails
 * @param {string} eventId - The id of the event
 * @param {string} roomTypeId - The id of the room type
 * @param {string} addOnId - The id of the add-on
 * @param {EventRoomTypeAddOnDetailsUpdateInputs} details - The details to update
 * @version 1.2
 **/

export interface UpdateEventRoomTypeAddOnDetailsParams extends MutationParams {
  eventId: string;
  roomTypeId: string;
  addOnId: string;
  details: EventRoomTypeAddOnDetailsUpdateInputs;
}

export const UpdateEventRoomTypeAddOnDetails = async ({
  eventId,
  roomTypeId,
  addOnId,
  details,
  adminApiParams,
  queryClient,
}: UpdateEventRoomTypeAddOnDetailsParams): Promise<
  ConnectedXMResponse<EventRoomType>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<EventRoomType>>(
    `/events/${eventId}/roomTypes/${roomTypeId}/addOns/${addOnId}`,
    details
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ROOM_TYPE_QUERY_KEY(eventId, roomTypeId),
    });
    SET_EVENT_ROOM_TYPE_QUERY_DATA(
      queryClient,
      [eventId, roomTypeId || data.data?.id],
      data
    );
  }
  return data;
};

export const useUpdateEventRoomTypeAddOnDetails = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventRoomTypeAddOnDetails>>,
      Omit<
        UpdateEventRoomTypeAddOnDetailsParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventRoomTypeAddOnDetailsParams,
    Awaited<ReturnType<typeof UpdateEventRoomTypeAddOnDetails>>
  >(UpdateEventRoomTypeAddOnDetails, options, {
    domain: "events",
    type: "update",
  });
};