import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_TICKETS_QUERY_KEY } from "@context/queries/events/tickets/useGetEventTickets";
import { useRouter } from "next/router";
import { EVENT_TICKET_QUERY_KEY } from "@context/queries/events/tickets/useGetEventTicket";

interface DeleteTicketParams {
  eventId: string;
  ticketId: string;
}

export const DeleteTicket = async ({
  eventId,
  ticketId,
}: DeleteTicketParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/tickets/${ticketId}`
  );
  return data;
};

export const useDeleteTicket = (eventId: string, ticketId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useConnectedMutation(() => DeleteTicket({ eventId, ticketId }), {
    onSuccess: async (_response: Awaited<ReturnType<typeof DeleteTicket>>) => {
      await router.push(`/events/${eventId}/tickets`);
      queryClient.invalidateQueries(EVENT_TICKETS_QUERY_KEY(eventId));
      queryClient.removeQueries(EVENT_TICKET_QUERY_KEY(eventId, ticketId));
    },
  });
};

export default useDeleteTicket;
