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
export interface AddEventPassAddOnParams extends MutationParams {
  addOnId: string;
  eventId: string;
  passId: string;
}

/**
 * @category Methods
 * @group Event-Attendee-Passes
 */
export const AddEventPassAddOn = async ({
  addOnId,
  eventId,
  passId,
  adminApiParams,
  queryClient,
}: AddEventPassAddOnParams): Promise<ConnectedXMResponse<EventPass>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<EventPass>>(
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
export const useAddEventPassAddOn = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventPassAddOn>>,
      Omit<AddEventPassAddOnParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventPassAddOnParams,
    Awaited<ReturnType<typeof AddEventPassAddOn>>
  >(AddEventPassAddOn, options, {
    domain: "events",
    type: "update",
  });
};
