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
export interface RemoveEventAttendeeReservationPassParams
  extends MutationParams {
  eventId: string;
  accountId: string;
  reservationId: string;
  passId: string;
}

/**
 * @category Methods
 * @group Event-AddOns
 */
export const RemoveEventAttendeeReservationPass = async ({
  eventId,
  accountId,
  reservationId,
  passId,
  adminApiParams,
  queryClient,
}: RemoveEventAttendeeReservationPassParams): Promise<
  ConnectedXMResponse<EventRoomTypeReservation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<
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
export const useRemoveEventAttendeeReservationPass = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventAttendeeReservationPass>>,
      Omit<
        RemoveEventAttendeeReservationPassParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventAttendeeReservationPassParams,
    Awaited<ReturnType<typeof RemoveEventAttendeeReservationPass>>
  >(RemoveEventAttendeeReservationPass, options, {
    domain: "events",
    type: "update",
  });
};
