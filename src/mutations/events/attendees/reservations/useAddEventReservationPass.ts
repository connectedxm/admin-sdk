import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventRoomTypeReservation } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ATTENDEE_RESERVATIONS_QUERY_KEY,
  EVENT_RESERVATIONS_QUERY_KEY,
  EVENT_RESERVATION_PASSES_QUERY_KEY,
} from "@src/queries";

/**
 * Endpoint to add a reservation pass to a specific event.
 * This function allows users to associate a pass with a reservation for an event, potentially updating the reservation details.
 * It is designed to be used in applications where event management and reservation handling are required.
 * @name AddEventReservationPass
 * @param {string} eventId (path) The id of the event
 * @param {string} reservationId (path) The id of the reservation
 * @param {string} passId (path) The id of the pass
 * @version 1.3
 **/
export interface AddEventReservationPassParams extends MutationParams {
  eventId: string;
  reservationId: string;
  passId: string;
  accountId?: string;
}

export const AddEventReservationPass = async ({
  eventId,
  reservationId,
  passId,
  accountId,
  adminApiParams,
  queryClient,
}: AddEventReservationPassParams): Promise<
  ConnectedXMResponse<EventRoomTypeReservation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<
    ConnectedXMResponse<EventRoomTypeReservation>
  >(`/events/${eventId}/reservations/${reservationId}/passes/${passId}`);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_RESERVATION_PASSES_QUERY_KEY(eventId, reservationId),
    });
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
};

export const useAddEventReservationPass = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventReservationPass>>,
      Omit<AddEventReservationPassParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventReservationPassParams,
    Awaited<ReturnType<typeof AddEventReservationPass>>
  >(AddEventReservationPass, options, {
    domain: "events",
    type: "update",
  });
};
