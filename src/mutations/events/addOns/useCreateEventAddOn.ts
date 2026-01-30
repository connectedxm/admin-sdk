import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventAddOn } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventAddOnCreateInputs } from "@src/params";
import {
  EVENT_ADD_ONS_QUERY_KEY,
  SET_EVENT_ADD_ON_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-AddOns
 */
export interface CreateEventAddOnParams extends MutationParams {
  eventId: string;
  addOn: EventAddOnCreateInputs;
}

/**
 * @category Methods
 * @group Event-AddOns
 */
export const CreateEventAddOn = async ({
  eventId,
  addOn,
  adminApiParams,
  queryClient,
}: CreateEventAddOnParams): Promise<ConnectedXMResponse<EventAddOn>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventAddOn>>(
    `/events/${eventId}/addOns`,
    addOn
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ADD_ONS_QUERY_KEY(eventId),
    });
    SET_EVENT_ADD_ON_QUERY_DATA(queryClient, [eventId, data.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-AddOns
 */
export const useCreateEventAddOn = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventAddOn>>,
      Omit<CreateEventAddOnParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventAddOnParams,
    Awaited<ReturnType<typeof CreateEventAddOn>>
  >(CreateEventAddOn, options);
};
