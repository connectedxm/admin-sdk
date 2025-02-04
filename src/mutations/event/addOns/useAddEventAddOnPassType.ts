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
export interface AddEventAddOnPassTypeParams extends MutationParams {
  eventId: string;
  addOnId: string;
  passTypeId: string;
}

/**
 * @category Methods
 * @group Event-AddOns
 */
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

/**
 * @category Mutations
 * @group Event-AddOns
 */
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
