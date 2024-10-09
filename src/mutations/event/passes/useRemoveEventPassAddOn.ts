import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPass } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_PASS_ADD_ONS_QUERY_KEY,
  SET_EVENT_PASS_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Attendee-Passes
 */
export interface RemoveEventPassAddOnParams extends MutationParams {
  addOnId: string;
  eventId: string;
  passId: string;
}

/**
 * @category Methods
 * @group Event-Attendee-Passes
 */
export const RemoveEventPassAddOn = async ({
  addOnId,
  eventId,
  passId,
  adminApiParams,
  queryClient,
}: RemoveEventPassAddOnParams): Promise<ConnectedXMResponse<EventPass>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<EventPass>>(
    `/events/${eventId}/passes/${passId}/addOns/${addOnId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_ADD_ONS_QUERY_KEY(eventId, passId),
    });
    SET_EVENT_PASS_QUERY_DATA(queryClient, [eventId, passId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Attendee-Passes
 */
export const useRemoveEventPassAddOn = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventPassAddOn>>,
      Omit<RemoveEventPassAddOnParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventPassAddOnParams,
    Awaited<ReturnType<typeof RemoveEventPassAddOn>>
  >(RemoveEventPassAddOn, options, {
    domain: "events",
    type: "update",
  });
};
