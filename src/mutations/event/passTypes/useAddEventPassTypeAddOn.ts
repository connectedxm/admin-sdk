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
 * Adds an add-on to a specific event pass type and invalidates the relevant queries.
 * This function is used to associate an additional feature or service (add-on) with a particular event pass type.
 * It ensures that the relevant queries are invalidated to maintain data consistency across the application.
 * @name AddEventPassTypeAddOn
 * @param {string} eventId - The id of the event
 * @param {string} passTypeId - The id of the pass type
 * @param {string} addOnId - The id of the add-on
 * @version 1.2
**/

export interface AddEventPassTypeAddOnParams extends MutationParams {
  eventId: string;
  passTypeId: string;
  addOnId: string;
}

export const AddEventPassTypeAddOn = async ({
  eventId,
  passTypeId,
  addOnId,
  adminApiParams,
  queryClient,
}: AddEventPassTypeAddOnParams): Promise<
  ConnectedXMResponse<EventPassType>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<EventPassType>>(
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
  >(AddEventPassTypeAddOn, options, {
    domain: "events",
    type: "update",
  });
};