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
export interface RemoveEventAddOnTierParams extends MutationParams {
  allowed: boolean;
  eventId: string;
  addOnId: string;
  tierId: string;
}

/**
 * @category Methods
 * @group Event-AddOns
 */
export const RemoveEventAddOnTier = async ({
  allowed,
  eventId,
  addOnId,
  tierId,
  adminApiParams,
  queryClient,
}: RemoveEventAddOnTierParams): Promise<ConnectedXMResponse<EventAddOn>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<EventAddOn>>(
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

/**
 * @category Mutations
 * @group Event-AddOns
 */
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
