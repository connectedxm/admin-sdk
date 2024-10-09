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
 * @category Params
 * @group Event-AddOns
 */
export interface RemoveEventAddOnPassTypeParams extends MutationParams {
  eventId: string;
  addOnId: string;
  passTypeId: string;
}

/**
 * @category Methods
 * @group Event-AddOns
 */
export const RemoveEventAddOnPassType = async ({
  eventId,
  addOnId,
  passTypeId,
  adminApiParams,
  queryClient,
}: RemoveEventAddOnPassTypeParams): Promise<
  ConnectedXMResponse<EventAddOn>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<EventAddOn>>(
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

/**
 * @category Mutations
 * @group Event-AddOns
 */
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
