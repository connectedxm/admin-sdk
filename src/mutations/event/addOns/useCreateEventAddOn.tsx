import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventAddOn } from "@src/interfaces";
import {
  MutationOptions,
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
export interface CreateAddOnParams extends MutationParams {
  eventId: string;
  addOn: EventAddOn;
}

/**
 * @category Methods
 * @group Event-AddOns
 */
export const CreateAddOn = async ({
  eventId,
  addOn,
  adminApiParams,
  queryClient,
}: CreateAddOnParams): Promise<ConnectedXMResponse<EventAddOn>> => {
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
export const useCreateAddOn = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateAddOn>>,
      Omit<CreateAddOnParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateAddOnParams,
    Awaited<ReturnType<typeof CreateAddOn>>
  >(CreateAddOn, options);
};
