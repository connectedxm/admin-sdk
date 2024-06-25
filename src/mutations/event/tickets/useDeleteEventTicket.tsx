import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_TICKETS_QUERY_KEY, EVENT_TICKET_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event-Tickets
 */
export interface DeleteEventTicketParams extends MutationParams {
  eventId: string;
  ticketId: string;
}

/**
 * @category Methods
 * @group Event-Tickets
 */
export const DeleteEventTicket = async ({
  eventId,
  ticketId,
  adminApiParams,
  queryClient,
}: DeleteEventTicketParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/tickets/${ticketId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_TICKETS_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_TICKET_QUERY_KEY(eventId, ticketId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Tickets
 */
export const useDeleteEventTicket = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventTicket>>,
      Omit<DeleteEventTicketParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventTicketParams,
    Awaited<ReturnType<typeof DeleteEventTicket>>
  >(DeleteEventTicket, options);
};
