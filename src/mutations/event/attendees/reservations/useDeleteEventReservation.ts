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
 * @category Params
 * @group Event-AddOns
 */
export interface DeleteEventReservationParams extends MutationParams {
  eventId: string;
  reservationId: string;
  accountId?: string;
}

/**
 * @category Methods
 * @group Event-AddOns
 */
export const DeleteEventReservation = async ({
  eventId,
  reservationId,
  accountId,
  adminApiParams,
  queryClient,
}: DeleteEventReservationParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
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

/**
 * @category Mutations
 * @group Event-AddOns
 */
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
