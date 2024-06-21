import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { Ticket } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { SET_EVENT_TICKET_QUERY_DATA } from "@context/queries/events/tickets/useGetEventTicket";
import { EVENT_TICKETS_QUERY_KEY } from "@context/queries/events/tickets/useGetEventTickets";

interface UpdateTicketParams {
  eventId: string;
  ticketId: string;
  ticket: Ticket;
}

export const UpdateTicket = async ({
  eventId,
  ticketId,
  ticket,
}: UpdateTicketParams): Promise<ConnectedXMResponse<Ticket>> => {
  if (!ticketId) throw new Error("Ticket ID Undefined");
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/events/${eventId}/tickets/${ticketId}`,
    {
      ...ticket,
      id: undefined,
      featuredImage: undefined,
      allowedTiers: undefined,
      event: undefined,
      _count: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
  );
  return data;
};

export const useUpdateTicket = (eventId: string, ticketId?: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<Ticket>(
    (ticket: Ticket) =>
      UpdateTicket({ eventId, ticketId: ticketId || ticket?.id, ticket }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof UpdateTicket>>) => {
        queryClient.invalidateQueries(EVENT_TICKETS_QUERY_KEY(eventId));
        SET_EVENT_TICKET_QUERY_DATA(
          queryClient,
          [eventId, ticketId || response.data?.id],
          response
        );
      },
    }
  );
};

export default useUpdateTicket;
