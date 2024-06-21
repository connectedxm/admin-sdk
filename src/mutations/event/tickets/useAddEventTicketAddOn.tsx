import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Ticket } from "@interfaces";
import { SET_EVENT_TICKET_QUERY_DATA } from "@context/queries/events/tickets/useGetEventTicket";
import { EVENT_TICKET_ADD_ONS_QUERY_KEY } from "@context/queries/events/tickets/useGetEventTicketAddOns";

interface AddEventTicketAddOnParams {
  eventId: string;
  ticketId: string;
  addOnId: string;
}

export const AddEventTicketAddOn = async ({
  eventId,
  ticketId,
  addOnId,
}: AddEventTicketAddOnParams): Promise<ConnectedXMResponse<Ticket>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/tickets/${ticketId}/addOns/${addOnId}`
  );
  return data;
};

export const useAddEventTicketAddOn = (eventId: string, ticketId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (addOnId: string) => AddEventTicketAddOn({ eventId, ticketId, addOnId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof AddEventTicketAddOn>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_TICKET_ADD_ONS_QUERY_KEY(eventId, ticketId)
        );
        SET_EVENT_TICKET_QUERY_DATA(queryClient, [eventId, ticketId], response);
      },
    }
  );
};

export default useAddEventTicketAddOn;
