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
 * Endpoint to remove a pass type from a specific event add-on.
 * This function allows the removal of a pass type associated with a particular event add-on, 
 * facilitating the management of event configurations by updating the event's add-on details.
 * @name RemoveEventAddOnPassType
 * @param {string} eventId - The id of the event
 * @param {string} addOnId - The id of the add-on
 * @param {string} passTypeId - The id of the pass type
 * @version 1.2
**/
export interface RemoveEventAddOnPassTypeParams extends MutationParams {
  eventId: string;
  addOnId: string;
  passTypeId: string;
}

export const RemoveEventAddOnPassType = async ({
  eventId,
  addOnId,
  passTypeId,
  adminApiParams,
  queryClient,
}: RemoveEventAddOnPassTypeParams): Promise<
  ConnectedXMResponse<EventAddOn>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<EventAddOn>>(
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

export const useRemoveEventAddOnPassType = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventAddOnPassType>>,
      Omit<RemoveEventAddOnPassTypeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventAddOnPassTypeParams,
    Awaited<ReturnType<typeof RemoveEventAddOnPassType>>
  >(RemoveEventAddOnPassType, options, {
    domain: "events",
    type: "update",
  });
};