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
 * @category Params
 * @group Event-Attendees
 */
export interface UpdateEventReservationParams extends MutationParams {
  eventId: string;
  reservationId: string;
  reservation: EventRoomTypeReservationUpdateInputs;
  accountId?: string;
}

/**
 * @category Methods
 * @group Event-Attendees
 */
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
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put(
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
};

/**
 * @category Mutations
 * @group Event-Attendees
 */
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
  >(UpdateEventReservation, options);
};
