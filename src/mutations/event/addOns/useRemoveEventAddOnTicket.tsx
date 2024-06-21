import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { EventAddOn } from "@interfaces";
import { EVENT_ADD_ON_TICKETS_QUERY_KEY } from "@context/queries/events/addOns/useGetEventAddOnTickets";
import { SET_EVENT_ADD_ON_QUERY_DATA } from "@context/queries/events/addOns/useGetEventAddOn";

interface RemoveEventAddOnTicketParams {
  eventId: string;
  addOnId: string;
  ticketId: string;
}

export const RemoveEventAddOnTicket = async ({
  eventId,
  addOnId,
  ticketId,
}: RemoveEventAddOnTicketParams): Promise<ConnectedXMResponse<EventAddOn>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/addOns/${addOnId}/tickets/${ticketId}`
  );
  return data;
};

export const useRemoveEventAddOnTicket = (eventId: string, addOnId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (ticketId: string) =>
      RemoveEventAddOnTicket({ eventId, addOnId, ticketId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof RemoveEventAddOnTicket>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_ADD_ON_TICKETS_QUERY_KEY(eventId, addOnId)
        );
        SET_EVENT_ADD_ON_QUERY_DATA(queryClient, [eventId, addOnId], response);
      },
    },
    undefined,
    true
  );
};

export default useRemoveEventAddOnTicket;
