import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ATTENDEE_RESERVATIONS_QUERY_KEY,
  EVENT_RESERVATIONS_QUERY_KEY,
  EVENT_RESERVATION_QUERY_KEY,
} from "@src/queries";

/**
 * Endpoint to delete a reservation for a specific event.
 * This function allows the removal of a reservation associated with a particular event, 
 * providing the ability to specify an optional account ID for more granular control.
 * It is designed for use in applications where event management and reservation handling are required.
 * @name DeleteEventReservation
 * @param {string} eventId - The id of the event
 * @param {string} reservationId - The id of the reservation
 * @param {string} [accountId] - Optional account id
 * @version 1.2
 **/
export interface DeleteEventReservationParams extends MutationParams {
  eventId: string;
  reservationId: string;
  accountId?: string;
}

export const DeleteEventReservation = async ({
  eventId,
  reservationId,
  accountId,
  adminApiParams,
  queryClient,
}: DeleteEventReservationParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/reservations/${reservationId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      queryKey: EVENT_RESERVATION_QUERY_KEY(eventId, reservationId),
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

export const useDeleteEventReservation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventReservation>>,
      Omit<DeleteEventReservationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventReservationParams,
    Awaited<ReturnType<typeof DeleteEventReservation>>
  >(DeleteEventReservation, options, {
    domain: "events",
    type: "update",
  });
};