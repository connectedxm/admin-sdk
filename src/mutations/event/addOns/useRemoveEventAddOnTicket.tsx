import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventAddOn } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ADD_ON_TICKETS_QUERY_KEY,
  SET_EVENT_ADD_ON_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-AddOns
 */
export interface RemoveEventAddOnTicketParams extends MutationParams {
  eventId: string;
  addOnId: string;
  ticketId: string;
}

/**
 * @category Methods
 * @group Event-AddOns
 */
export const RemoveEventAddOnTicket = async ({
  eventId,
  addOnId,
  ticketId,
  adminApiParams,
  queryClient,
}: RemoveEventAddOnTicketParams): Promise<ConnectedXMResponse<EventAddOn>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<EventAddOn>>(
    `/events/${eventId}/addOns/${addOnId}/tickets/${ticketId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ADD_ON_TICKETS_QUERY_KEY(eventId, addOnId),
    });
    SET_EVENT_ADD_ON_QUERY_DATA(queryClient, [eventId, addOnId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-AddOns
 */
export const useRemoveEventAddOnTicket = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveEventAddOnTicket>>,
      Omit<RemoveEventAddOnTicketParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventAddOnTicketParams,
    Awaited<ReturnType<typeof RemoveEventAddOnTicket>>
  >(RemoveEventAddOnTicket, options);
};
