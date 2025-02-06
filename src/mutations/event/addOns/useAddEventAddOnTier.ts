import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventAddOn } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ADD_ON_TIERS_QUERY_KEY,
  SET_EVENT_ADD_ON_QUERY_DATA,
} from "@src/queries";

/**
 * Adds a tier to an event add-on and updates the relevant queries.
 * This function is used to manage event add-ons by allowing the addition of tiers, 
 * which can be configured to be allowed or disallowed. It ensures that the application 
 * state is consistent by invalidating and updating the necessary queries.
 * @name AddEventAddOnTier
 * @param {boolean} allowed (bodyValue) - Indicates if the tier is allowed
 * @param {string} eventId (path) - The ID of the event
 * @param {string} addOnId (path) - The ID of the add-on
 * @param {string} tierId (path) - The ID of the tier
 * @version 1.3
**/
export interface AddEventAddOnTierParams extends MutationParams {
  allowed: boolean;
  eventId: string;
  addOnId: string;
  tierId: string;
}

export const AddEventAddOnTier = async ({
  allowed,
  eventId,
  addOnId,
  tierId,
  adminApiParams,
  queryClient,
}: AddEventAddOnTierParams): Promise<ConnectedXMResponse<EventAddOn>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<EventAddOn>>(
    `/events/${eventId}/addOns/${addOnId}/tiers/${tierId}`,
    {
      allowed,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ADD_ON_TIERS_QUERY_KEY(allowed, eventId, addOnId),
    });
    SET_EVENT_ADD_ON_QUERY_DATA(queryClient, [eventId, addOnId], data);
  }
  return data;
};

export const useAddEventAddOnTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventAddOnTier>>,
      Omit<AddEventAddOnTierParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventAddOnTierParams,
    Awaited<ReturnType<typeof AddEventAddOnTier>>
  >(AddEventAddOnTier, options, {
    domain: "events",
    type: "update",
  });
};