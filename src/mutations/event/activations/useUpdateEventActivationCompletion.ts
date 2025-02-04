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
 * @category Params
 * @group Event-Activations
 */
export interface UpdateEventActivationCompletionParams extends MutationParams {
  eventId: string;
  activationId: string;
  completionId: string;
  completion: EventActivationCompletionUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Activations
 */
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
};

/**
 * @category Mutations
 * @group Event-Activations
 */
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
