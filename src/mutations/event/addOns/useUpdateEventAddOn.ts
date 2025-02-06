import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventAddOn } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventAddOnUpdateInputs } from "@src/params";
import {
  EVENT_ADD_ONS_QUERY_KEY,
  SET_EVENT_ADD_ON_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to update an existing event add-on with new data.
 * This function allows updating the details of a specific add-on associated with an event.
 * It is designed to be used in applications where modifications to event add-ons are required.
 * @name UpdateEventAddOn
 * @param {string} eventId (path) - The id of the event
 * @param {string} addOnId (path) - The id of the add-on
 * @param {EventAddOnUpdateInputs} addOn (body) - The new data for the add-on
 * @version 1.3
 **/

export interface UpdateEventAddOnParams extends MutationParams {
  eventId: string;
  addOnId: string;
  addOn: EventAddOnUpdateInputs;
}

export const UpdateEventAddOn = async ({
  eventId,
  addOnId,
  addOn,
  adminApiParams,
  queryClient,
}: UpdateEventAddOnParams): Promise<ConnectedXMResponse<EventAddOn>> => {
  if (!addOnId) throw new Error("Add On ID Undefined");
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<EventAddOn>>(
    `/events/${eventId}/addOns/${addOnId}`,
    {
      ...addOn,
      id: undefined,
      event: undefined,
      eventId: undefined,
      allowedTickets: undefined,
      allowedTiers: undefined,
      _count: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      image: undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ADD_ONS_QUERY_KEY(eventId),
    });
    SET_EVENT_ADD_ON_QUERY_DATA(
      queryClient,
      [eventId, addOnId || data.data?.id],
      data
    );
  }
  return data;
}

export const useUpdateEventAddOn = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventAddOn>>,
      Omit<UpdateEventAddOnParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventAddOnParams,
    Awaited<ReturnType<typeof UpdateEventAddOn>>
  >(UpdateEventAddOn, options, {
    domain: "events",
    type: "update",
  });
};