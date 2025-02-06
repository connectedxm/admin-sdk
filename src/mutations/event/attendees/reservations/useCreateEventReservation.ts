import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventRoomTypeReservation } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventRoomTypeReservationCreateInputs } from "@src/params";
import {
  EVENT_ATTENDEE_RESERVATIONS_QUERY_KEY,
  EVENT_RESERVATIONS_QUERY_KEY,
  SET_EVENT_RESERVATION_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to create a reservation for an event.
 * This function allows users to create a reservation for a specific event by providing the event ID and reservation details.
 * It is designed to be used in applications where event management and reservation functionalities are required.
 * @name CreateEventReservation
 * @param {string} eventId (path) The id of the event
 * @param {EventRoomTypeReservationCreateInputs} reservation (body) The reservation details
 * @version 1.2
 **/

export interface CreateEventReservationParams extends MutationParams {
  eventId: string;
  reservation: EventRoomTypeReservationCreateInputs;
  accountId?: string;
}

export const CreateEventReservation = async ({
  eventId,
  reservation,
  accountId,
  adminApiParams,
  queryClient,
}: CreateEventReservationParams): Promise<
  ConnectedXMResponse<EventRoomTypeReservation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post(
    `/events/${eventId}/reservations`,
    reservation
  );
  if (queryClient && data.status === "ok") {
    SET_EVENT_RESERVATION_QUERY_DATA(
      queryClient,
      [eventId, data.data.id],
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
};

export const useCreateEventReservation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventReservation>>,
      Omit<CreateEventReservationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventReservationParams,
    Awaited<ReturnType<typeof CreateEventReservation>>
  >(CreateEventReservation, options, {
    domain: "events",
    type: "update",
  });
};
