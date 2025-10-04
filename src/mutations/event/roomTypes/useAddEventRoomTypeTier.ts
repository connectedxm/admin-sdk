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
 * @category Params
 * @group Event-Reservations
 */
export interface AddEventRoomTypeTierParams extends MutationParams {
  allowed: boolean;
  eventId: string;
  roomTypeId: string;
  tierId: string;
}

/**
 * @category Methods
 * @group Event-Reservations
 */
export const AddEventRoomTypeTier = async ({
  allowed,
  eventId,
  roomTypeId,
  tierId,
  adminApiParams,
  queryClient,
}: AddEventRoomTypeTierParams): Promise<ConnectedXMResponse<EventRoomType>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post(
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

/**
 * @category Mutations
 * @group Event-Reservations
 */
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
  >(AddEventRoomTypeTier, options);
};
