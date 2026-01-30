import { GetAdminAPI } from "@src/AdminAPI";
import { ActivationCompletion, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventActivationCompletionUpdateInputs } from "@src/params";
import {
  EVENT_ACTIVATION_COMPLETIONS_QUERY_KEY,
  SET_EVENT_ACTIVATION_COMPLETION_QUERY_DATA,
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
  ConnectedXMResponse<ActivationCompletion>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<ActivationCompletion>
  >(
    `/events/${eventId}/activations/${activationId}/completions/${completionId}`,
    completion
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ACTIVATION_COMPLETIONS_QUERY_KEY(eventId, activationId),
    });
    SET_EVENT_ACTIVATION_COMPLETION_QUERY_DATA(
      queryClient,
      [eventId, activationId, completionId],
      data
    );
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
  >(UpdateEventActivationCompletion, options);
};
