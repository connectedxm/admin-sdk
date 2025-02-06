import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventRoomType } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ROOM_TYPE_TIERS_QUERY_KEY,
  SET_EVENT_ROOM_TYPE_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to add a new tier to a room type for a specific event.
 * This function allows the addition of a tier to a specified room type within an event, 
 * indicating whether the tier is allowed. It is used in scenarios where event room types 
 * need to be dynamically updated with new tiers.
 * @name AddEventRoomTypeTier
 * @param {boolean} allowed (bodyValue) - Indicates if the tier is allowed
 * @param {string} eventId (path) - The id of the event
 * @param {string} roomTypeId (path) - The id of the room type
 * @param {string} tierId (path) - The id of the tier
 * @version 1.3
 **/
export interface AddEventRoomTypeTierParams extends MutationParams {
  allowed: boolean;
  eventId: string;
  roomTypeId: string;
  tierId: string;
}

export const AddEventRoomTypeTier = async ({
  allowed,
  eventId,
  roomTypeId,
  tierId,
  adminApiParams,
  queryClient,
}: AddEventRoomTypeTierParams): Promise<ConnectedXMResponse<EventRoomType>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post(
    `/events/${eventId}/roomTypes/${roomTypeId}/tiers/${tierId}`,
    {
      allowed,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ROOM_TYPE_TIERS_QUERY_KEY(allowed, eventId, roomTypeId),
    });
    SET_EVENT_ROOM_TYPE_QUERY_DATA(queryClient, [eventId, roomTypeId], data);
  }
  return data;
};

export const useAddEventRoomTypeTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventRoomTypeTier>>,
      Omit<AddEventRoomTypeTierParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventRoomTypeTierParams,
    Awaited<ReturnType<typeof AddEventRoomTypeTier>>
  >(AddEventRoomTypeTier, options, {
    domain: "events",
    type: "update",
  });
};