import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventTicket } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_TICKET_TIERS_QUERY_KEY,
  SET_EVENT_TICKET_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Tickets
 */
export interface AddEventTicketTierParams extends MutationParams {
  eventId: string;
  ticketId: string;
  tierId: string;
}

/**
 * @category Methods
 * @group Event-Tickets
 */
export const AddEventTicketTier = async ({
  eventId,
  ticketId,
  tierId,
  adminApiParams,
  queryClient,
}: AddEventTicketTierParams): Promise<ConnectedXMResponse<EventTicket>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventTicket>>(
    `/events/${eventId}/tickets/${ticketId}/tiers/${tierId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_TICKET_TIERS_QUERY_KEY(eventId, ticketId),
    });
    SET_EVENT_TICKET_QUERY_DATA(queryClient, [eventId, ticketId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Tickets
 */
export const useAddEventTicketTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventTicketTier>>,
      Omit<AddEventTicketTierParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventTicketTierParams,
    Awaited<ReturnType<typeof AddEventTicketTier>>
  >(AddEventTicketTier, options);
};
