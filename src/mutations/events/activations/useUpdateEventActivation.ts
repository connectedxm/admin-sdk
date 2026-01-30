import { GetAdminAPI } from "@src/AdminAPI";
import { EventActivation, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventActivationUpdateInputs } from "@src/params";
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
  activation: EventActivationUpdateInputs;
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
}: UpdateEventActivationParams): Promise<
  ConnectedXMResponse<EventActivation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<EventActivation>>(
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
    ConnectedXMMutationOptions<
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
