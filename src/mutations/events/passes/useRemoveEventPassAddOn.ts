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
 * Endpoint to remove an add-on from an event pass.
 * This function allows the removal of a specific add-on associated with an event pass, identified by the add-on ID, event ID, and pass ID.
 * It is used in scenarios where an event pass needs to be updated by removing an existing add-on.
 * @name RemoveEventPassAddOn
 * @param {string} addOnId (path) The id of the add-on to be removed
 * @param {string} eventId (path) The id of the event
 * @param {string} passId (path) The id of the pass
 * @version 1.3
 **/
export interface RemoveEventPassAddOnParams extends MutationParams {
  addOnId: string;
  eventId: string;
  passId: string;
}

export const RemoveEventPassAddOn = async ({
  addOnId,
  eventId,
  passId,
  adminApiParams,
  queryClient,
}: RemoveEventPassAddOnParams): Promise<ConnectedXMResponse<EventPass>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<EventPass>>(
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

export const useRemoveEventPassAddOn = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventPassAddOn>>,
      Omit<RemoveEventPassAddOnParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventPassAddOnParams,
    Awaited<ReturnType<typeof RemoveEventPassAddOn>>
  >(RemoveEventPassAddOn, options, {
    domain: "events",
    type: "update",
  });
};
