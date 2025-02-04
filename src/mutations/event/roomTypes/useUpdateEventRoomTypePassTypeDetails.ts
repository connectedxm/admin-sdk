import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventRoomType } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventRoomTypePassTypeDetailsUpdateInputs } from "@src/params";
import {
  EVENT_ROOM_TYPE_QUERY_KEY,
  SET_EVENT_ROOM_TYPE_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to update the details of a specific pass type for a room type in an event.
 * This function allows updating the details of a pass type associated with a room type within a specific event.
 * It is designed to be used in applications where event management and room type configurations are required.
 * @name UpdateEventRoomTypePassTypeDetails
 * @param {string} eventId - The id of the event
 * @param {string} roomTypeId - The id of the room type
 * @param {string} passTypeId - The id of the pass type
 * @param {EventRoomTypePassTypeDetailsUpdateInputs} details - The details to update
 * @version 1.2
 **/

export interface UpdateEventRoomTypePassTypeDetailsParams
  extends MutationParams {
  eventId: string;
  roomTypeId: string;
  passTypeId: string;
  details: EventRoomTypePassTypeDetailsUpdateInputs;
}

export const UpdateEventRoomTypePassTypeDetails = async ({
  eventId,
  roomTypeId,
  passTypeId,
  details,
  adminApiParams,
  queryClient,
}: UpdateEventRoomTypePassTypeDetailsParams): Promise<
  ConnectedXMResponse<EventRoomType>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<EventRoomType>>(
    `/events/${eventId}/roomTypes/${roomTypeId}/passTypes/${passTypeId}`,
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

export const useUpdateEventRoomTypePassTypeDetails = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventRoomTypePassTypeDetails>>,
      Omit<
        UpdateEventRoomTypePassTypeDetailsParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventRoomTypePassTypeDetailsParams,
    Awaited<ReturnType<typeof UpdateEventRoomTypePassTypeDetails>>
  >(UpdateEventRoomTypePassTypeDetails, options, {
    domain: "events",
    type: "update",
  });
};