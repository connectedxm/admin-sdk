import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ACTIVATION_COMPLETIONS_QUERY_KEY,
  EVENT_ACTIVATION_COMPLETION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Activations
 */
export interface DeleteEventActivationCompletionParams extends MutationParams {
  eventId: string;
  activationId: string;
  completionId: string;
}

/**
 * @category Methods
 * @group Event-Activations
 */
export const DeleteEventActivationCompletion = async ({
  eventId,
  activationId,
  completionId,
  adminApiParams,
  queryClient,
}: DeleteEventActivationCompletionParams): Promise<
  ConnectedXMResponse<null>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/activations/${activationId}/completions/${completionId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ACTIVATION_COMPLETIONS_QUERY_KEY(eventId, activationId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_ACTIVATION_COMPLETION_QUERY_KEY(
        eventId,
        activationId,
        completionId
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Activations
 */
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
