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
export interface AddEventAddOnTicketParams extends MutationParams {
  eventId: string;
  addOnId: string;
  ticketId: string;
}

/**
 * @category Methods
 * @group Event-AddOns
 */
export const AddEventAddOnTicket = async ({
  eventId,
  addOnId,
  ticketId,
  adminApiParams,
  queryClient,
}: AddEventAddOnTicketParams): Promise<ConnectedXMResponse<EventAddOn>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventAddOn>>(
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
export const useAddEventAddOnTicket = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddEventAddOnTicket>>,
      Omit<AddEventAddOnTicketParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventAddOnTicketParams,
    Awaited<ReturnType<typeof AddEventAddOnTicket>>
  >(AddEventAddOnTicket, options);
};
