import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Ticket } from "@interfaces";
import { EVENT_TICKET_TIERS_QUERY_KEY } from "@context/queries/events/tickets/useGetEventTicketTiers";
import { SET_EVENT_TICKET_QUERY_DATA } from "@context/queries/events/tickets/useGetEventTicket";

interface AddEventTicketTierParams {
  eventId: string;
  ticketId: string;
  tierId: string;
}

export const AddEventTicketTier = async ({
  eventId,
  ticketId,
  tierId,
}: AddEventTicketTierParams): Promise<ConnectedXMResponse<Ticket>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/tickets/${ticketId}/tiers/${tierId}`
  );
  return data;
};

export const useAddEventTicketTier = (eventId: string, ticketId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (tierId: string) => AddEventTicketTier({ eventId, ticketId, tierId }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof AddEventTicketTier>>) => {
        queryClient.invalidateQueries(
          EVENT_TICKET_TIERS_QUERY_KEY(eventId, ticketId)
        );
        SET_EVENT_TICKET_QUERY_DATA(queryClient, [eventId, ticketId], response);
      },
    }
  );
};

export default useAddEventTicketTier;
