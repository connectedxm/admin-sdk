import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_ADD_ONS_QUERY_KEY, EVENT_ADD_ON_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete an add-on from a specific event.
 * This function allows the removal of an add-on associated with a given event by specifying the event and add-on IDs.
 * It is useful in scenarios where event configurations need to be updated by removing unnecessary or outdated add-ons.
 * @name DeleteEventAddOn
 * @param {string} eventId (path) The id of the event
 * @param {string} addOnId (path) The id of the add-on
 * @version 1.3
 **/

export interface DeleteEventAddOnParams extends MutationParams {
  eventId: string;
  addOnId: string;
}

export const DeleteEventAddOn = async ({
  eventId,
  addOnId,
  adminApiParams,
  queryClient,
}: DeleteEventAddOnParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/addOns/${addOnId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ADD_ONS_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_ADD_ON_QUERY_KEY(eventId, addOnId),
    });
  }
  return data;
};

export const useDeleteEventAddOn = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventAddOn>>,
      Omit<DeleteEventAddOnParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventAddOnParams,
    Awaited<ReturnType<typeof DeleteEventAddOn>>
  >(DeleteEventAddOn, options, {
    domain: "events",
    type: "update",
  });
};
