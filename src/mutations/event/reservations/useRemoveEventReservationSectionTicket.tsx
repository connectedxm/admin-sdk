import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { EventReservationSection } from "@interfaces";
import { EVENT_RESERVATION_SECTION_TICKETS_QUERY_KEY } from "@context/queries/events/reservations/useGetEventReservationSectionTickets";
import { SET_EVENT_RESERVATION_SECTION_QUERY_DATA } from "@context/queries/events/reservations/useGetEventReservationSection";

interface RemoveEventReservationSectionTicketParams {
  eventId: string;
  reservationSectionId: string;
  ticketId: string;
}

export const RemoveEventReservationSectionTicket = async ({
  eventId,
  reservationSectionId,
  ticketId,
}: RemoveEventReservationSectionTicketParams): Promise<
  ConnectedXMResponse<EventReservationSection>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/reservationSections/${reservationSectionId}/tickets/${ticketId}`
  );
  return data;
};

export const useRemoveEventReservationSectionTicket = (
  eventId: string,
  reservationSectionId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (ticketId: string) =>
      RemoveEventReservationSectionTicket({
        eventId,
        reservationSectionId,
        ticketId,
      }),
    {
      onSuccess: (
        response: Awaited<
          ReturnType<typeof RemoveEventReservationSectionTicket>
        >
      ) => {
        queryClient.invalidateQueries(
          EVENT_RESERVATION_SECTION_TICKETS_QUERY_KEY(
            eventId,
            reservationSectionId
          )
        );
        SET_EVENT_RESERVATION_SECTION_QUERY_DATA(
          queryClient,
          [eventId, reservationSectionId],
          response
        );
      },
    },
    undefined,
    true
  );
};

export default useRemoveEventReservationSectionTicket;
