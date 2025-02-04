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
 * Endpoint to remove a reservation pass for a specific event.
 * This function allows the removal of a pass associated with a reservation for a given event.
 * It is useful in scenarios where a pass needs to be invalidated or removed from an event reservation.
 * @name RemoveEventReservationPass
 * @param {string} eventId - The id of the event
 * @param {string} reservationId - The id of the reservation
 * @param {string} passId - The id of the pass
 * @param {string} [accountId] - Optional account id
 * @version 1.2
 **/
export interface RemoveEventReservationPassParams extends MutationParams {
  eventId: string;
  reservationId: string;
  passId: string;
  accountId?: string;
}

export const RemoveEventReservationPass = async ({
  eventId,
  reservationId,
  passId,
  accountId,
  adminApiParams,
  queryClient,
}: RemoveEventReservationPassParams): Promise<
  ConnectedXMResponse<EventRoomTypeReservation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<
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

export const useRemoveEventReservationPass = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventReservationPass>>,
      Omit<RemoveEventReservationPassParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventReservationPassParams,
    Awaited<ReturnType<typeof RemoveEventReservationPass>>
  >(RemoveEventReservationPass, options, {
    domain: "events",
    type: "update",
  });
};