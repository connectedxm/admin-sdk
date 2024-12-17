import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventAttendee } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_PASS_QUERY_KEY,
  EVENT_RESERVATION_SECTIONS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Attendee-Passes
 */
export interface RemoveEventPassReservationParams extends MutationParams {
  eventId: string;
  accountId: string;
  passId: string;
}

/**
 * @category Methods
 * @group Event-Attendee-Passes
 */
export const RemoveEventPassReservation = async ({
  eventId,
  accountId,
  passId,
  adminApiParams,
  queryClient,
}: RemoveEventPassReservationParams): Promise<
  ConnectedXMResponse<EventAttendee>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<EventAttendee>>(
    `/events/${eventId}/attendees/${accountId}/passes/${passId}/reservations`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_RESERVATION_SECTIONS_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_QUERY_KEY(eventId, passId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Attendee-Passes
 */
export const useRemoveEventPassReservation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventPassReservation>>,
      Omit<RemoveEventPassReservationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventPassReservationParams,
    Awaited<ReturnType<typeof RemoveEventPassReservation>>
  >(RemoveEventPassReservation, options, {
    domain: "events",
    type: "update",
  });
};
