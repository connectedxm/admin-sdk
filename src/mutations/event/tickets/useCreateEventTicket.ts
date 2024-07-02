import { GetAdminAPI } from "@src/AdminAPI";
import { EventTicket, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventTicketCreateParams } from "@src/params";
import {
  EVENT_TICKETS_QUERY_KEY,
  SET_EVENT_TICKET_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Tickets
 */
export interface CreateEventTicketParams extends MutationParams {
  eventId: string;
  ticket: EventTicketCreateParams;
}

/**
 * @category Methods
 * @group Event-Tickets
 */
export const CreateEventTicket = async ({
  eventId,
  ticket,
  adminApiParams,
  queryClient,
}: CreateEventTicketParams): Promise<ConnectedXMResponse<EventTicket>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventTicket>>(
    `/events/${eventId}/tickets`,
    ticket
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_TICKETS_QUERY_KEY(eventId),
    });
    SET_EVENT_TICKET_QUERY_DATA(queryClient, [eventId, data.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Tickets
 */
export const useCreateEventTicket = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventTicket>>,
      Omit<CreateEventTicketParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventTicketParams,
    Awaited<ReturnType<typeof CreateEventTicket>>
  >(CreateEventTicket, options);
};
