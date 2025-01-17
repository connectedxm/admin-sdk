import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ATTENDEE_RESERVATIONS_QUERY_KEY,
  EVENT_ATTENDEE_RESERVATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-AddOns
 */
export interface DeleteEventAttendeeReservationParams extends MutationParams {
  eventId: string;
  accountId: string;
  reservationId: string;
}

/**
 * @category Methods
 * @group Event-AddOns
 */
export const DeleteEventAttendeeReservation = async ({
  eventId,
  accountId,
  reservationId,
  adminApiParams,
  queryClient,
}: DeleteEventAttendeeReservationParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/attendees/${accountId}/reservations/${reservationId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_RESERVATIONS_QUERY_KEY(eventId, reservationId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_ATTENDEE_RESERVATION_QUERY_KEY(
        eventId,
        accountId,
        reservationId
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-AddOns
 */
export const useDeleteEventAttendeeReservation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventAttendeeReservation>>,
      Omit<
        DeleteEventAttendeeReservationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventAttendeeReservationParams,
    Awaited<ReturnType<typeof DeleteEventAttendeeReservation>>
  >(DeleteEventAttendeeReservation, options, {
    domain: "events",
    type: "update",
  });
};
