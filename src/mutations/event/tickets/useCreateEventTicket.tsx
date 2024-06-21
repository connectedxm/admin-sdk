import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { Ticket } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_TICKETS_QUERY_KEY } from "@context/queries/events/tickets/useGetEventTickets";
import { SET_EVENT_TICKET_QUERY_DATA } from "@context/queries/events/tickets/useGetEventTicket";

interface CreateTicketParams {
  eventId: string;
  ticket: Ticket;
}

export const CreateTicket = async ({
  eventId,
  ticket,
}: CreateTicketParams): Promise<ConnectedXMResponse<Ticket>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(`/events/${eventId}/tickets`, ticket);
  return data;
};

export const useCreateTicket = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<Ticket>(
    (ticket: Ticket) => CreateTicket({ eventId, ticket }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof CreateTicket>>) => {
        queryClient.invalidateQueries(EVENT_TICKETS_QUERY_KEY(eventId));
        SET_EVENT_TICKET_QUERY_DATA(
          queryClient,
          [eventId, response.data.id],
          response
        );
      },
    }
  );
};

export default useCreateTicket;
