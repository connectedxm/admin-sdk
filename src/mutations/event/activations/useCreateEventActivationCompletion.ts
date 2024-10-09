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
  ConnectedXMResponse<EventActivation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventActivation>>(
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
