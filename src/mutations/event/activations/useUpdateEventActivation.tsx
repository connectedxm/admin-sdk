import { GetAdminAPI } from "@src/AdminAPI";
import { Activation, ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ACTIVATIONS_QUERY_KEY,
  SET_EVENT_ACTIVATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Activations
 */
export interface UpdateEventActivationParams extends MutationParams {
  eventId: string;
  activationId: string;
  activation: Activation;
}

/**
 * @category Methods
 * @group Event-Activations
 */
export const UpdateEventActivation = async ({
  eventId,
  activationId,
  activation,
  adminApiParams,
  queryClient,
}: UpdateEventActivationParams): Promise<ConnectedXMResponse<Activation>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Activation>>(
    `/events/${eventId}/activations/${activationId}`,
    activation
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
export const useUpdateEventActivation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEventActivation>>,
      Omit<UpdateEventActivationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventActivationParams,
    Awaited<ReturnType<typeof UpdateEventActivation>>
  >(UpdateEventActivation, options);
};
