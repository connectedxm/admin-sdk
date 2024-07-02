import { GetAdminAPI } from "@src/AdminAPI";
import { EventTicket, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventTicketUpdateParams } from "@src/params";
import {
  EVENT_TICKETS_QUERY_KEY,
  SET_EVENT_TICKET_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Tickets
 */
export interface UpdateEventTicketParams extends MutationParams {
  eventId: string;
  ticketId: string;
  ticket: EventTicketUpdateParams;
}

/**
 * @category Methods
 * @group Event-Tickets
 */
export const UpdateEventTicket = async ({
  eventId,
  ticketId,
  ticket,
  adminApiParams,
  queryClient,
}: UpdateEventTicketParams): Promise<ConnectedXMResponse<EventTicket>> => {
  if (!ticketId) throw new Error("Ticket ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<EventTicket>>(
    `/events/${eventId}/tickets/${ticketId}`,
    {
      ...ticket,
      id: undefined,
      featuredImage: undefined,
      allowedTiers: undefined,
      event: undefined,
      _count: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_TICKETS_QUERY_KEY(eventId),
    });
    SET_EVENT_TICKET_QUERY_DATA(
      queryClient,
      [eventId, ticketId || data.data?.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Tickets
 */
export const useUpdateEventTicket = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventTicket>>,
      Omit<UpdateEventTicketParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventTicketParams,
    Awaited<ReturnType<typeof UpdateEventTicket>>
  >(UpdateEventTicket, options);
};
