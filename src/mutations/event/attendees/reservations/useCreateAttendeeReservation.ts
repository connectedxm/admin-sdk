import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventRoomTypeReservation } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventRoomTypeReservationCreateInputs } from "@src/params";
import {
  SET_EVENT_ATTENDEE_RESERVATION_QUERY_DATA,
  EVENT_ATTENDEE_RESERVATIONS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Attendees
 */
export interface CreateEventAttendeeReservationParams extends MutationParams {
  eventId: string;
  accountId: string;
  reservation: EventRoomTypeReservationCreateInputs;
}

/**
 * @category Methods
 * @group Event-Attendees
 */
export const CreateEventAttendeeReservation = async ({
  eventId,
  accountId,
  reservation,
  adminApiParams,
  queryClient,
}: CreateEventAttendeeReservationParams): Promise<
  ConnectedXMResponse<EventRoomTypeReservation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post(
    `/events/${eventId}/attendees/${accountId}/reservations`,
    reservation
  );
  if (queryClient && data.status === "ok") {
    SET_EVENT_ATTENDEE_RESERVATION_QUERY_DATA(
      queryClient,
      [eventId, accountId, data.data.id],
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
export const useCreateEventAttendeeReservation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventAttendeeReservation>>,
      Omit<
        CreateEventAttendeeReservationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventAttendeeReservationParams,
    Awaited<ReturnType<typeof CreateEventAttendeeReservation>>
  >(CreateEventAttendeeReservation, options, {
    domain: "events",
    type: "update",
  });
};
