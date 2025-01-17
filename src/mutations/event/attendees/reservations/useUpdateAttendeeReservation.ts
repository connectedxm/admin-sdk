import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventRoomTypeReservation } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventRoomTypeReservationUpdateInputs } from "@src/params";
import {
  SET_EVENT_ATTENDEE_RESERVATION_QUERY_DATA,
  EVENT_ATTENDEE_RESERVATIONS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Attendees
 */
export interface UpdateEventAttendeeReservationParams extends MutationParams {
  eventId: string;
  accountId: string;
  reservationId: string;
  reservation: EventRoomTypeReservationUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Attendees
 */
export const UpdateEventAttendeeReservation = async ({
  eventId,
  accountId,
  reservationId,
  reservation,
  adminApiParams,
  queryClient,
}: UpdateEventAttendeeReservationParams): Promise<
  ConnectedXMResponse<EventRoomTypeReservation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put(
    `/events/${eventId}/attendees/${accountId}/reservations/${reservationId}`,
    reservation
  );
  if (queryClient && data.status === "ok") {
    SET_EVENT_ATTENDEE_RESERVATION_QUERY_DATA(
      queryClient,
      [eventId, accountId, reservationId],
      data
    );
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_RESERVATIONS_QUERY_KEY(eventId, accountId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Attendees
 */
export const useUpdateEventAttendeeReservation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventAttendeeReservation>>,
      Omit<
        UpdateEventAttendeeReservationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventAttendeeReservationParams,
    Awaited<ReturnType<typeof UpdateEventAttendeeReservation>>
  >(UpdateEventAttendeeReservation, options, {
    domain: "events",
    type: "update",
  });
};
