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
export interface RemoveEventReservationSectionTicketParams
  extends MutationParams {
  eventId: string;
  reservationSectionId: string;
  ticketId: string;
}

/**
 * @category Methods
 * @group Event-Reservations
 */
export const RemoveEventReservationSectionTicket = async ({
  eventId,
  reservationSectionId,
  ticketId,
  adminApiParams,
  queryClient,
}: RemoveEventReservationSectionTicketParams): Promise<
  ConnectedXMResponse<EventReservationSection>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<
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
export const useRemoveEventReservationSectionTicket = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveEventReservationSectionTicket>>,
      Omit<
        RemoveEventReservationSectionTicketParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventReservationSectionTicketParams,
    Awaited<ReturnType<typeof RemoveEventReservationSectionTicket>>
  >(RemoveEventReservationSectionTicket, options);
};
