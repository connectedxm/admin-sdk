import { GetAdminAPI } from "@src/AdminAPI";
import { EventActivation, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventActivationCompletionUpdateInputs } from "@src/params";
import {
  EVENT_ACTIVATIONS_QUERY_KEY,
  SET_EVENT_ACTIVATION_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to update the completion status of an event activation.
 * This function allows updating the completion details of a specific event activation by providing the necessary identifiers and update inputs.
 * It is intended for use in scenarios where the completion status of an event activation needs to be modified.
 * @name UpdateEventActivationCompletion
 * @param {string} eventId - The id of the event
 * @param {string} activationId - The id of the activation
 * @param {string} completionId - The id of the completion
 * @param {EventActivationCompletionUpdateInputs} completion - The completion update inputs
 * @version 1.2
 **/

export interface UpdateEventActivationCompletionParams extends MutationParams {
  eventId: string;
  activationId: string;
  completionId: string;
  completion: EventActivationCompletionUpdateInputs;
}

export const UpdateEventActivationCompletion = async ({
  eventId,
  activationId,
  completionId,
  completion,
  adminApiParams,
  queryClient,
}: UpdateEventActivationCompletionParams): Promise<
  ConnectedXMResponse<EventActivation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<EventActivation>>(
    `/events/${eventId}/activations/${activationId}/completions/${completionId}`,
    completion
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ACTIVATIONS_QUERY_KEY(eventId),
    });
    SET_EVENT_ACTIVATION_QUERY_DATA(queryClient, [eventId, data.data.id], data);
  }
  return data;
}

export const useUpdateEventActivationCompletion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventActivationCompletion>>,
      Omit<
        UpdateEventActivationCompletionParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventActivationCompletionParams,
    Awaited<ReturnType<typeof UpdateEventActivationCompletion>>
  >(UpdateEventActivationCompletion, options, {
    domain: "events",
    type: "update",
  });
};