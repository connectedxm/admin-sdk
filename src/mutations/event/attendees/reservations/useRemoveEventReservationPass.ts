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
export interface RemoveEventReservationPassParams extends MutationParams {
  eventId: string;
  reservationId: string;
  passId: string;
  accountId?: string;
}

/**
 * @category Methods
 * @group Event-AddOns
 */
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

/**
 * @category Mutations
 * @group Event-AddOns
 */
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
