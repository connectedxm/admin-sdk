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
export interface RemoveEventTicketAddOnParams extends MutationParams {
  eventId: string;
  ticketId: string;
  addOnId: string;
}

/**
 * @category Methods
 * @group Event-Tickets
 */
export const RemoveEventTicketAddOn = async ({
  eventId,
  ticketId,
  addOnId,
  adminApiParams,
  queryClient,
}: RemoveEventTicketAddOnParams): Promise<ConnectedXMResponse<EventTicket>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<EventTicket>>(
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
export const useRemoveEventTicketAddOn = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventTicketAddOn>>,
      Omit<RemoveEventTicketAddOnParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventTicketAddOnParams,
    Awaited<ReturnType<typeof RemoveEventTicketAddOn>>
  >(RemoveEventTicketAddOn, options);
};
