import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_ADD_ONS_QUERY_KEY, EVENT_ADD_ON_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event-AddOns
 */
export interface DeleteAddOnParams extends MutationParams {
  eventId: string;
  addOnId: string;
}

/**
 * @category Methods
 * @group Event-AddOns
 */
export const DeleteAddOn = async ({
  eventId,
  addOnId,
  adminApiParams,
  queryClient,
}: DeleteAddOnParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
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

/**
 * @category Mutations
 * @group Event-AddOns
 */
export const useDeleteAddOn = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteAddOn>>,
      Omit<DeleteAddOnParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteAddOnParams,
    Awaited<ReturnType<typeof DeleteAddOn>>
  >(DeleteAddOn, options);
};
