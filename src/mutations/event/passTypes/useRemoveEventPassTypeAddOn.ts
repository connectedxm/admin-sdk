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
export interface RemoveEventPassTypeAddOnParams extends MutationParams {
  eventId: string;
  passTypeId: string;
  addOnId: string;
}

/**
 * @category Methods
 * @group Event-PassTypes
 */
export const RemoveEventPassTypeAddOn = async ({
  eventId,
  passTypeId,
  addOnId,
  adminApiParams,
  queryClient,
}: RemoveEventPassTypeAddOnParams): Promise<
  ConnectedXMResponse<EventPassType>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<EventPassType>>(
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
export const useRemoveEventPassTypeAddOn = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventPassTypeAddOn>>,
      Omit<RemoveEventPassTypeAddOnParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventPassTypeAddOnParams,
    Awaited<ReturnType<typeof RemoveEventPassTypeAddOn>>
  >(RemoveEventPassTypeAddOn, options, {
    domain: "events",
    type: "update",
  });
};
