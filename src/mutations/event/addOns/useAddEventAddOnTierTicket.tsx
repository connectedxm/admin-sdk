import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { EventAddOn } from "@interfaces";
import { EVENT_ADD_ON_TICKETS_QUERY_KEY } from "@context/queries/events/addOns/useGetEventAddOnTickets";
import { SET_EVENT_ADD_ON_QUERY_DATA } from "@context/queries/events/addOns/useGetEventAddOn";

interface AddEventAddOnTicketParams {
  eventId: string;
  addOnId: string;
  ticketId: string;
}

export const AddEventAddOnTicket = async ({
  eventId,
  addOnId,
  ticketId,
}: AddEventAddOnTicketParams): Promise<ConnectedXMResponse<EventAddOn>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/addOns/${addOnId}/tickets/${ticketId}`
  );
  return data;
};

export const useAddEventAddOnTicket = (eventId: string, addOnId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (ticketId: string) => AddEventAddOnTicket({ eventId, addOnId, ticketId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof AddEventAddOnTicket>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_ADD_ON_TICKETS_QUERY_KEY(eventId, addOnId)
        );
        SET_EVENT_ADD_ON_QUERY_DATA(queryClient, [eventId, addOnId], response);
      },
    }
  );
};

export default useAddEventAddOnTicket;
