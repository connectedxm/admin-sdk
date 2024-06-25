import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventReservationSection } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_RESERVATION_SECTION_TICKETS_QUERY_KEY,
  SET_EVENT_RESERVATION_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Reservations
 */
export interface AddEventReservationSectionTicketParams extends MutationParams {
  eventId: string;
  reservationSectionId: string;
  ticketId: string;
}

/**
 * @category Methods
 * @group Event-Reservations
 */
export const AddEventReservationSectionTicket = async ({
  eventId,
  reservationSectionId,
  ticketId,
  adminApiParams,
  queryClient,
}: AddEventReservationSectionTicketParams): Promise<
  ConnectedXMResponse<EventReservationSection>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventReservationSection>
  >(
    `/events/${eventId}/reservationSections/${reservationSectionId}/tickets/${ticketId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_RESERVATION_SECTION_TICKETS_QUERY_KEY(
        eventId,
        reservationSectionId
      ),
    });
    SET_EVENT_RESERVATION_SECTION_QUERY_DATA(
      queryClient,
      [eventId, reservationSectionId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Reservations
 */
export const useAddEventReservationSectionTicket = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddEventReservationSectionTicket>>,
      Omit<
        AddEventReservationSectionTicketParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventReservationSectionTicketParams,
    Awaited<ReturnType<typeof AddEventReservationSectionTicket>>
  >(AddEventReservationSectionTicket, options);
};
