import { GetAdminAPI } from "@src/AdminAPI";
import { ActivationCompletion, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventActivationCompletionCreateInputs } from "@src/params";
import { EVENT_ACTIVATION_COMPLETIONS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event-Activations
 */
export interface CreateEventActivationCompletionParams extends MutationParams {
  eventId: string;
  activationId: string;
  completion: EventActivationCompletionCreateInputs;
}

/**
 * @category Methods
 * @group Event-Activations
 */
export const CreateEventActivationCompletion = async ({
  eventId,
  activationId,
  completion,
  adminApiParams,
  queryClient,
}: CreateEventActivationCompletionParams): Promise<
  ConnectedXMResponse<ActivationCompletion>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<ActivationCompletion>
  >(`/events/${eventId}/activations/${activationId}/completions`, completion);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ACTIVATION_COMPLETIONS_QUERY_KEY(eventId, activationId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Activations
 */
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
