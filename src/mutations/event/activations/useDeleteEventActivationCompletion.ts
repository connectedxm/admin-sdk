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
