import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventRoomTypeReservation } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_ATTENDEE_RESERVATION_PASSES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event-AddOns
 */
export interface AddEventAttendeeReservationPassParams extends MutationParams {
  eventId: string;
  accountId: string;
  reservationId: string;
  passId: string;
}

/**
 * @category Methods
 * @group Event-AddOns
 */
export const AddEventAttendeeReservationPass = async ({
  eventId,
  accountId,
  reservationId,
  passId,
  adminApiParams,
  queryClient,
}: AddEventAttendeeReservationPassParams): Promise<
  ConnectedXMResponse<EventRoomTypeReservation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventRoomTypeReservation>
  >(
    `/events/${eventId}/attendees/${accountId}/reservations/${reservationId}/passes/${passId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_RESERVATION_PASSES_QUERY_KEY(
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
export const useAddEventAttendeeReservationPass = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventAttendeeReservationPass>>,
      Omit<
        AddEventAttendeeReservationPassParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventAttendeeReservationPassParams,
    Awaited<ReturnType<typeof AddEventAttendeeReservationPass>>
  >(AddEventAttendeeReservationPass, options, {
    domain: "events",
    type: "update",
  });
};
