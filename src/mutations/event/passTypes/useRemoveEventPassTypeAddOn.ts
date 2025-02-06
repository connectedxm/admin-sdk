import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPassType } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_PASS_TYPE_ADD_ONS_QUERY_KEY,
  SET_EVENT_PASS_TYPE_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to remove an add-on from a specific event pass type.
 * This function allows the removal of an add-on associated with a particular event pass type by specifying the event ID, pass type ID, and add-on ID.
 * It is used in scenarios where an add-on needs to be detached from an event pass type, ensuring the event pass type is updated accordingly.
 * @name RemoveEventPassTypeAddOn
 * @param {string} eventId (path) The id of the event
 * @param {string} passTypeId (path) The id of the pass type
 * @param {string} addOnId (path) The id of the add-on
 * @version 1.3
 **/

export interface RemoveEventPassTypeAddOnParams extends MutationParams {
  eventId: string;
  passTypeId: string;
  addOnId: string;
}

export const RemoveEventPassTypeAddOn = async ({
  eventId,
  passTypeId,
  addOnId,
  adminApiParams,
  queryClient,
}: RemoveEventPassTypeAddOnParams): Promise<
  ConnectedXMResponse<EventPassType>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<EventPassType>>(
    `/events/${eventId}/passTypes/${passTypeId}/addOns/${addOnId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_TYPE_ADD_ONS_QUERY_KEY(eventId, passTypeId),
    });
    SET_EVENT_PASS_TYPE_QUERY_DATA(queryClient, [eventId, passTypeId], data);
  }
  return data;
};

export const useRemoveEventPassTypeAddOn = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventPassTypeAddOn>>,
      Omit<RemoveEventPassTypeAddOnParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventPassTypeAddOnParams,
    Awaited<ReturnType<typeof RemoveEventPassTypeAddOn>>
  >(RemoveEventPassTypeAddOn, options, {
    domain: "events",
    type: "update",
  });
};
