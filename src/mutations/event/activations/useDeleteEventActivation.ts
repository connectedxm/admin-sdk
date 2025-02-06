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
 * Endpoint to delete a specific event activation by its unique identifiers.
 * This function allows for the removal of an activation associated with a particular event.
 * It is designed to be used in applications where event activations need to be managed or removed.
 * @name DeleteEventActivation
 * @param {string} eventId (path) The id of the event
 * @param {string} activationId (path) The id of the activation
 * @version 1.3
 **/
export interface DeleteEventActivationParams extends MutationParams {
  eventId: string;
  activationId: string;
}

export const DeleteEventActivation = async ({
  eventId,
  activationId,
  adminApiParams,
  queryClient,
}: DeleteEventActivationParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
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
