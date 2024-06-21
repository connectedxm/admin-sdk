import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Ticket } from "@interfaces";
import { SET_EVENT_TICKET_QUERY_DATA } from "@context/queries/events/tickets/useGetEventTicket";
import { EVENT_TICKET_ADD_ONS_QUERY_KEY } from "@context/queries/events/tickets/useGetEventTicketAddOns";

interface RemoveEventTicketAddOnParams {
  eventId: string;
  ticketId: string;
  addOnId: string;
}

export const RemoveEventTicketAddOn = async ({
  eventId,
  ticketId,
  addOnId,
}: RemoveEventTicketAddOnParams): Promise<ConnectedXMResponse<Ticket>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/tickets/${ticketId}/addOns/${addOnId}`
  );
  return data;
};

export const useRemoveEventTicketAddOn = (
  eventId: string,
  ticketId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (addOnId: string) => RemoveEventTicketAddOn({ eventId, ticketId, addOnId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof RemoveEventTicketAddOn>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_TICKET_ADD_ONS_QUERY_KEY(eventId, ticketId)
        );
        SET_EVENT_TICKET_QUERY_DATA(queryClient, [eventId, ticketId], response);
      },
    },
    undefined,
    true
  );
};

export default useRemoveEventTicketAddOn;
