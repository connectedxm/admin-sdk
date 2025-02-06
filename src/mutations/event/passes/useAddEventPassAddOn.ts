import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPass } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_PASS_ADD_ONS_QUERY_KEY,
  SET_EVENT_PASS_QUERY_DATA,
} from "@src/queries";

/**
 * Adds an add-on to a specific event pass and invalidates the relevant queries to ensure data consistency.
 * This function is used to associate an additional feature or service (add-on) with an event pass, 
 * allowing for enhanced functionality or offerings for event attendees.
 * It is designed to be used in applications where event management and customization are required.
 * @name AddEventPassAddOn
 * @param {string} addOnId (path) - The id of the add-on
 * @param {string} eventId (path) - The id of the event
 * @param {string} passId (path) - The id of the pass
 * @version 1.3
 **/
export interface AddEventPassAddOnParams extends MutationParams {
  addOnId: string;
  eventId: string;
  passId: string;
}

export const AddEventPassAddOn = async ({
  addOnId,
  eventId,
  passId,
  adminApiParams,
  queryClient,
}: AddEventPassAddOnParams): Promise<ConnectedXMResponse<EventPass>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<EventPass>>(
    `/events/${eventId}/passes/${passId}/addOns/${addOnId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_ADD_ONS_QUERY_KEY(eventId, passId),
    });
    SET_EVENT_PASS_QUERY_DATA(queryClient, [eventId, passId], data);
  }
  return data;
};

export const useAddEventPassAddOn = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventPassAddOn>>,
      Omit<AddEventPassAddOnParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventPassAddOnParams,
    Awaited<ReturnType<typeof AddEventPassAddOn>>
  >(AddEventPassAddOn, options, {
    domain: "events",
    type: "update",
  });
};