import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventAddOn } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ADD_ON_PASS_TYPES_QUERY_KEY,
  SET_EVENT_ADD_ON_QUERY_DATA,
} from "@src/queries";

/**
 * Adds a pass type to an event's add-on and invalidates the relevant query.
 * This function is used to associate a specific pass type with an event add-on, ensuring that the event's add-on data is updated accordingly.
 * It is particularly useful in scenarios where event organizers need to manage and update pass types for their event add-ons.
 * @name AddEventAddOnPassType
 * @param {string} eventId (path) The id of the event
 * @param {string} addOnId (path) The id of the add-on
 * @param {string} passTypeId (path) The id of the pass type
 * @version 1.2
 **/
export interface AddEventAddOnPassTypeParams extends MutationParams {
  eventId: string;
  addOnId: string;
  passTypeId: string;
}

export const AddEventAddOnPassType = async ({
  eventId,
  addOnId,
  passTypeId,
  adminApiParams,
  queryClient,
}: AddEventAddOnPassTypeParams): Promise<ConnectedXMResponse<EventAddOn>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<EventAddOn>>(
    `/events/${eventId}/addOns/${addOnId}/passTypes/${passTypeId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ADD_ON_PASS_TYPES_QUERY_KEY(eventId, addOnId),
    });
    SET_EVENT_ADD_ON_QUERY_DATA(queryClient, [eventId, addOnId], data);
  }
  return data;
};

export const useAddEventAddOnPassType = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventAddOnPassType>>,
      Omit<AddEventAddOnPassTypeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventAddOnPassTypeParams,
    Awaited<ReturnType<typeof AddEventAddOnPassType>>
  >(AddEventAddOnPassType, options, {
    domain: "events",
    type: "update",
  });
};
