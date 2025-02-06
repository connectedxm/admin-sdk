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
 * Endpoint to remove a specific tier from an event add-on.
 * This function allows the removal of a tier associated with an event add-on, provided the operation is permitted.
 * It is used in scenarios where event add-on configurations need to be modified by removing tiers.
 * @name RemoveEventAddOnTier
 * @param {boolean} allowed (query) - Indicates if the operation is allowed
 * @param {string} eventId (path) - The id of the event
 * @param {string} addOnId (path) - The id of the add-on
 * @param {string} tierId (path) - The id of the tier
 * @version 1.3
**/
export interface RemoveEventAddOnTierParams extends MutationParams {
  allowed: boolean;
  eventId: string;
  addOnId: string;
  tierId: string;
}

export const RemoveEventAddOnTier = async ({
  allowed,
  eventId,
  addOnId,
  tierId,
  adminApiParams,
  queryClient,
}: RemoveEventAddOnTierParams): Promise<ConnectedXMResponse<EventAddOn>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<EventAddOn>>(
    `/events/${eventId}/addOns/${addOnId}/tiers/${tierId}`,
    {
      params: {
        allowed,
      },
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

export const useRemoveEventAddOnTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventAddOnTier>>,
      Omit<RemoveEventAddOnTierParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventAddOnTierParams,
    Awaited<ReturnType<typeof RemoveEventAddOnTier>>
  >(RemoveEventAddOnTier, options, {
    domain: "events",
    type: "update",
  });
};