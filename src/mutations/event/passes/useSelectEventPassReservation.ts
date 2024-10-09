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
export interface SelectEventPassReservationParams extends MutationParams {
  eventId: string;
  passId: string;
  locationId: string;
  reservation: {
    reservationStart?: string;
    reservationEnd?: string;
  };
}

/**
 * @category Methods
 * @group Event-Attendee-Passes
 */
export const SelectEventPassReservation = async ({
  eventId,
  passId,
  locationId,
  reservation,
  adminApiParams,
  queryClient,
}: SelectEventPassReservationParams): Promise<
  ConnectedXMResponse<EventAttendee>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventAttendee>>(
    `/events/${eventId}/passes/${passId}/reservations/${locationId}`,
    reservation
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
export const useSelectEventPassReservation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof SelectEventPassReservation>>,
      Omit<SelectEventPassReservationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SelectEventPassReservationParams,
    Awaited<ReturnType<typeof SelectEventPassReservation>>
  >(SelectEventPassReservation, options, {
    domain: "events",
    type: "update",
  });
};
