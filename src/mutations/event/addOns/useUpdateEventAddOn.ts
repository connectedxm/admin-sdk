import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventAddOn } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ADD_ONS_QUERY_KEY,
  SET_EVENT_ADD_ON_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-AddOns
 */
export interface UpdateAddOnParams extends MutationParams {
  eventId: string;
  addOnId: string;
  addOn: EventAddOn;
}

/**
 * @category Methods
 * @group Event-AddOns
 */
export const UpdateAddOn = async ({
  eventId,
  addOnId,
  addOn,
  adminApiParams,
  queryClient,
}: UpdateAddOnParams): Promise<ConnectedXMResponse<EventAddOn>> => {
  if (!addOnId) throw new Error("Add On ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<EventAddOn>>(
    `/events/${eventId}/addOns/${addOnId}`,
    {
      ...addOn,
      id: undefined,
      event: undefined,
      eventId: undefined,
      allowedTickets: undefined,
      allowedTiers: undefined,
      _count: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      image: undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ADD_ONS_QUERY_KEY(eventId),
    });
    SET_EVENT_ADD_ON_QUERY_DATA(
      queryClient,
      [eventId, addOnId || data.data?.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-AddOns
 */
export const useUpdateAddOn = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateAddOn>>,
      Omit<UpdateAddOnParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateAddOnParams,
    Awaited<ReturnType<typeof UpdateAddOn>>
  >(UpdateAddOn, options);
};
