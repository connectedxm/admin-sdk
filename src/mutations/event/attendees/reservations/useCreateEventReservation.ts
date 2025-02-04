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
 * @category Params
 * @group Event-Attendees
 */
export interface CreateEventReservationParams extends MutationParams {
  eventId: string;
  reservation: EventRoomTypeReservationCreateInputs;
  accountId?: string;
}

/**
 * @category Methods
 * @group Event-Attendees
 */
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

/**
 * @category Mutations
 * @group Event-Attendees
 */
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
