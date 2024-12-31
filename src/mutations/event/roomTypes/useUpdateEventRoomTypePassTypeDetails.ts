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
 * @category Params
 * @group Event-Reservations
 */
export interface UpdateEventRoomTypePassTypeDetailsParams
  extends MutationParams {
  eventId: string;
  roomTypeId: string;
  passTypeId: string;
  details: EventRoomTypePassTypeDetailsUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Reservations
 */
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
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<EventRoomType>>(
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

/**
 * @category Mutations
 * @group Event-Reservations
 */
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
