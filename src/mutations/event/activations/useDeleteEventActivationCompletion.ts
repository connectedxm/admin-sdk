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
 * Deletes a specific event activation completion and invalidates related queries.
 * This function is used to remove a completion from an event activation, ensuring that
 * any cached data related to the event or activation is invalidated to maintain data consistency.
 * It is particularly useful in scenarios where event activations are dynamically managed and
 * require real-time updates.
 * @name DeleteEventActivationCompletion
 * @param {string} eventId (path) The id of the event
 * @param {string} activationId (path) The id of the activation
 * @param {string} completionId (path) The id of the completion
 * @version 1.3
 **/
export interface DeleteEventActivationCompletionParams extends MutationParams {
  eventId: string;
  activationId: string;
  completionId: string;
}

export const DeleteEventActivationCompletion = async ({
  eventId,
  activationId,
  completionId,
  adminApiParams,
  queryClient,
}: DeleteEventActivationCompletionParams): Promise<
  ConnectedXMResponse<null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/activations/${activationId}/completions/${completionId}`
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

export const useDeleteEventActivationCompletion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventActivationCompletion>>,
      Omit<
        DeleteEventActivationCompletionParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventActivationCompletionParams,
    Awaited<ReturnType<typeof DeleteEventActivationCompletion>>
  >(DeleteEventActivationCompletion, options, {
    domain: "events",
    type: "update",
  });
};
