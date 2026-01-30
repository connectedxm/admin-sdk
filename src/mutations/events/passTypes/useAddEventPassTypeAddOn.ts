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
 * @category Params
 * @group Event-PassTypes
 */
export interface AddEventPassTypeAddOnParams extends MutationParams {
  eventId: string;
  passTypeId: string;
  addOnId: string;
}

/**
 * @category Methods
 * @group Event-PassTypes
 */
export const AddEventPassTypeAddOn = async ({
  eventId,
  passTypeId,
  addOnId,
  adminApiParams,
  queryClient,
}: AddEventPassTypeAddOnParams): Promise<
  ConnectedXMResponse<EventPassType>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventPassType>>(
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

/**
 * @category Mutations
 * @group Event-PassTypes
 */
export const useAddEventPassTypeAddOn = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventPassTypeAddOn>>,
      Omit<AddEventPassTypeAddOnParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventPassTypeAddOnParams,
    Awaited<ReturnType<typeof AddEventPassTypeAddOn>>
  >(AddEventPassTypeAddOn, options);
};
