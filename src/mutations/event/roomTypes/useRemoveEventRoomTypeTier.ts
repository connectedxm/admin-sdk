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
 * Endpoint to remove a tier from a specified room type for an event.
 * This function allows the removal of a specific tier from a room type within an event, provided the operation is allowed.
 * It is used in scenarios where event room configurations need to be adjusted by removing certain tiers.
 * @name RemoveEventRoomTypeTier
 * @param {boolean} allowed - Indicates if the operation is allowed
 * @param {string} eventId - The id of the event
 * @param {string} roomTypeId - The id of the room type
 * @param {string} tierId - The id of the tier
 * @version 1.2
 **/
export interface RemoveEventRoomTypeTierParams extends MutationParams {
  allowed: boolean;
  eventId: string;
  roomTypeId: string;
  tierId: string;
}

export const RemoveEventRoomTypeTier = async ({
  allowed,
  eventId,
  roomTypeId,
  tierId,
  adminApiParams,
  queryClient,
}: RemoveEventRoomTypeTierParams): Promise<
  ConnectedXMResponse<EventRoomType>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete(
    `/events/${eventId}/roomTypes/${roomTypeId}/tiers/${tierId}`,
    {
      params: {
        allowed,
      },
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

export const useRemoveEventRoomTypeTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventRoomTypeTier>>,
      Omit<RemoveEventRoomTypeTierParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventRoomTypeTierParams,
    Awaited<ReturnType<typeof RemoveEventRoomTypeTier>>
  >(RemoveEventRoomTypeTier, options, {
    domain: "events",
    type: "update",
  });
};