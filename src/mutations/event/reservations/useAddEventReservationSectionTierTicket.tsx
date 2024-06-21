import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { EventReservationSection } from "@interfaces";
import { EVENT_RESERVATION_SECTION_TICKETS_QUERY_KEY } from "@context/queries/events/reservations/useGetEventReservationSectionTickets";
import { SET_EVENT_RESERVATION_SECTION_QUERY_DATA } from "@context/queries/events/reservations/useGetEventReservationSection";

interface AddEventReservationSectionTicketParams {
  eventId: string;
  reservationSectionId: string;
  ticketId: string;
}

export const AddEventReservationSectionTicket = async ({
  eventId,
  reservationSectionId,
  ticketId,
}: AddEventReservationSectionTicketParams): Promise<
  ConnectedXMResponse<EventReservationSection>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/reservationSections/${reservationSectionId}/tickets/${ticketId}`
  );
  return data;
};

export const useAddEventReservationSectionTicket = (
  eventId: string,
  reservationSectionId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (ticketId: string) =>
      AddEventReservationSectionTicket({
        eventId,
        reservationSectionId,
        ticketId,
      }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof AddEventReservationSectionTicket>>
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
    }
  );
};

export default useAddEventReservationSectionTicket;
