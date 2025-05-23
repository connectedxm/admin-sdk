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
 * @category Params
 * @group Event-AddOns
 */
export interface AddEventAddOnTierParams extends MutationParams {
  allowed: boolean;
  eventId: string;
  addOnId: string;
  tierId: string;
}

/**
 * @category Methods
 * @group Event-AddOns
 */
export const AddEventAddOnTier = async ({
  allowed,
  eventId,
  addOnId,
  tierId,
  adminApiParams,
  queryClient,
}: AddEventAddOnTierParams): Promise<ConnectedXMResponse<EventAddOn>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventAddOn>>(
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

/**
 * @category Mutations
 * @group Event-AddOns
 */
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
