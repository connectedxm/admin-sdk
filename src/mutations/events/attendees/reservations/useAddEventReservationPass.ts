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
 * @category Params
 * @group Event-AddOns
 */
export interface AddEventReservationPassParams extends MutationParams {
  eventId: string;
  reservationId: string;
  passId: string;
  accountId?: string;
}

/**
 * @category Methods
 * @group Event-AddOns
 */
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
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
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

/**
 * @category Mutations
 * @group Event-AddOns
 */
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
  >(AddEventReservationPass, options);
};
