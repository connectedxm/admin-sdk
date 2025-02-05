import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventRoomTypeReservation } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventRoomTypeReservationUpdateInputs } from "@src/params";
import {
  EVENT_ATTENDEE_RESERVATIONS_QUERY_KEY,
  EVENT_RESERVATIONS_QUERY_KEY,
  SET_EVENT_RESERVATION_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to update an event reservation with new details.
 * This function allows updating the reservation details for a specific event and reservation ID.
 * It is designed to be used in applications where event reservation modifications are required.
 * @name UpdateEventReservation
 * @param {string} eventId - The id of the event
 * @param {string} reservationId - The id of the reservation
 * @param {EventRoomTypeReservationUpdateInputs} reservation - The reservation details to update
 * @param {string} [accountId] - Optional account id
 * @version 1.2
**/

export interface UpdateEventReservationParams extends MutationParams {
  eventId: string;
  reservationId: string;
  reservation: EventRoomTypeReservationUpdateInputs;
  accountId?: string;
}

export const UpdateEventReservation = async ({
  eventId,
  reservationId,
  reservation,
  accountId,
  adminApiParams,
  queryClient,
}: UpdateEventReservationParams): Promise<
  ConnectedXMResponse<EventRoomTypeReservation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put(
    `/events/${eventId}/reservations/${reservationId}`,
    reservation
  );
  if (queryClient && data.status === "ok") {
    SET_EVENT_RESERVATION_QUERY_DATA(
      queryClient,
      [eventId, reservationId],
      data
    );
    queryClient.invalidateQueries({
      queryKey: EVENT_RESERVATIONS_QUERY_KEY(eventId),
    });

    if (accountId) {
      queryClient.invalidateQueries({
        queryKey: EVENT_ATTENDEE_RESERVATIONS_QUERY_KEY(eventId, accountId),
      });
    }
  }
  return data;
}

export const useUpdateEventReservation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventReservation>>,
      Omit<UpdateEventReservationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventReservationParams,
    Awaited<ReturnType<typeof UpdateEventReservation>>
  >(UpdateEventReservation, options, {
    domain: "events",
    type: "update",
  });
};