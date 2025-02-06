import { GetAdminAPI } from "@src/AdminAPI";
import { EventActivation, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventActivationCompletionCreateInputs } from "@src/params";
import {
  EVENT_ACTIVATIONS_QUERY_KEY,
  SET_EVENT_ACTIVATION_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to create a completion for a specific event activation.
 * This function allows the creation of a completion record for a given event activation,
 * utilizing the provided event and activation identifiers along with the completion inputs.
 * It is designed to be used in scenarios where event activations need to be completed
 * and tracked within the system.
 * @name CreateEventActivationCompletion
 * @param {string} eventId (path) - The id of the event
 * @param {string} activationId (path) - The id of the activation
 * @param {EventActivationCompletionCreateInputs} completion (body) - The completion inputs
 * @version 1.3
 **/
export interface CreateEventActivationCompletionParams extends MutationParams {
  eventId: string;
  activationId: string;
  completion: EventActivationCompletionCreateInputs;
}

export const CreateEventActivationCompletion = async ({
  eventId,
  activationId,
  completion,
  adminApiParams,
  queryClient,
}: CreateEventActivationCompletionParams): Promise<
  ConnectedXMResponse<EventActivation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<EventActivation>>(
    `/events/${eventId}/activations/${activationId}/completions`,
    completion
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ACTIVATIONS_QUERY_KEY(eventId),
    });
    SET_EVENT_ACTIVATION_QUERY_DATA(queryClient, [eventId, data.data.id], data);
  }
  return data;
};

export const useCreateEventActivationCompletion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventActivationCompletion>>,
      Omit<
        CreateEventActivationCompletionParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventActivationCompletionParams,
    Awaited<ReturnType<typeof CreateEventActivationCompletion>>
  >(CreateEventActivationCompletion, options, {
    domain: "events",
    type: "update",
  });
};