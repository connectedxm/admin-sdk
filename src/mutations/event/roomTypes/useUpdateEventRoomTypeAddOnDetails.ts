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
 * @category Params
 * @group Event-Reservations
 */
export interface UpdateEventRoomTypeAddOnDetailsParams extends MutationParams {
  eventId: string;
  roomTypeId: string;
  addOnId: string;
  details: EventRoomTypeAddOnDetailsUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Reservations
 */
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

/**
 * @category Mutations
 * @group Event-Reservations
 */
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
