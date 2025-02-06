import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventRoomType } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventRoomTypeCreateInputs } from "@src/params";
import {
  EVENT_ROOM_TYPES_QUERY_KEY,
  SET_EVENT_ROOM_TYPE_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to create a new event room type within a specified event.
 * This function allows the creation of a new room type for an event by providing the necessary inputs.
 * It is designed to be used in applications where event management and customization are required.
 * @name CreateEventRoomType
 * @param {string} eventId (path) - The id of the event
 * @param {EventRoomTypeCreateInputs} roomType (body) - The inputs for creating the event room type
 * @version 1.3
 **/

export interface CreateEventRoomTypeParams extends MutationParams {
  eventId: string;
  roomType: EventRoomTypeCreateInputs;
}

export const CreateEventRoomType = async ({
  eventId,
  roomType,
  adminApiParams,
  queryClient,
}: CreateEventRoomTypeParams): Promise<ConnectedXMResponse<EventRoomType>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post(
    `/events/${eventId}/roomTypes`,
    roomType
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ROOM_TYPES_QUERY_KEY(eventId),
    });
    SET_EVENT_ROOM_TYPE_QUERY_DATA(queryClient, [eventId, data.data.id], data);
  }
  return data;
};

export const useCreateEventRoomType = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventRoomType>>,
      Omit<CreateEventRoomTypeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventRoomTypeParams,
    Awaited<ReturnType<typeof CreateEventRoomType>>
  >(CreateEventRoomType, options, {
    domain: "events",
    type: "update",
  });
};