import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ACTIVATIONS_QUERY_KEY,
  EVENT_ACTIVATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Activations
 */
export interface DeleteEventActivationParams extends MutationParams {
  eventId: string;
  activationId: string;
}

/**
 * @category Methods
 * @group Event-Activations
 */
export const DeleteEventActivation = async ({
  eventId,
  activationId,
  adminApiParams,
  queryClient,
}: DeleteEventActivationParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/activations/${activationId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ACTIVATIONS_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_ACTIVATION_QUERY_KEY(eventId, activationId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Activations
 */
export const useDeleteEventActivation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventActivation>>,
      Omit<DeleteEventActivationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventActivationParams,
    Awaited<ReturnType<typeof DeleteEventActivation>>
  >(DeleteEventActivation, options, {
    domain: "events",
    type: "update",
  });
};
