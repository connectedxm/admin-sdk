import { GetAdminAPI } from "@src/AdminAPI";
import { EventActivation, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventActivationCreateInputs } from "@src/params";
import {
  EVENT_ACTIVATIONS_QUERY_KEY,
  SET_EVENT_ACTIVATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Activations
 */
export interface CreateEventActivationParams extends MutationParams {
  eventId: string;
  activation: EventActivationCreateInputs;
}

/**
 * @category Methods
 * @group Event-Activations
 */
export const CreateEventActivation = async ({
  eventId,
  activation,
  adminApiParams,
  queryClient,
}: CreateEventActivationParams): Promise<
  ConnectedXMResponse<EventActivation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventActivation>>(
    `/events/${eventId}/activations`,
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
export const useCreateEventActivation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventActivation>>,
      Omit<CreateEventActivationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventActivationParams,
    Awaited<ReturnType<typeof CreateEventActivation>>
  >(CreateEventActivation, options);
};
