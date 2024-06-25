import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventTicket } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_TICKET_ADD_ONS_QUERY_KEY,
  SET_EVENT_TICKET_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Tickets
 */
export interface AddEventTicketAddOnParams extends MutationParams {
  eventId: string;
  ticketId: string;
  addOnId: string;
}

/**
 * @category Methods
 * @group Event-Tickets
 */
export const AddEventTicketAddOn = async ({
  eventId,
  ticketId,
  addOnId,
  adminApiParams,
  queryClient,
}: AddEventTicketAddOnParams): Promise<ConnectedXMResponse<EventTicket>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventTicket>>(
    `/events/${eventId}/tickets/${ticketId}/addOns/${addOnId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_TICKET_ADD_ONS_QUERY_KEY(eventId, ticketId),
    });
    SET_EVENT_TICKET_QUERY_DATA(queryClient, [eventId, ticketId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Tickets
 */
export const useAddEventTicketAddOn = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventTicketAddOn>>,
      Omit<AddEventTicketAddOnParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventTicketAddOnParams,
    Awaited<ReturnType<typeof AddEventTicketAddOn>>
  >(AddEventTicketAddOn, options);
};
