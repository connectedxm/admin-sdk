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
 * Endpoint to create a new event activation.
 * This function allows the creation of an event activation by providing the necessary event ID and activation inputs.
 * It is designed to be used in applications where event activations need to be managed and updated.
 * @name CreateEventActivation
 * @param {string} eventId - The id of the event
 * @param {EventActivationCreateInputs} activation - The activation inputs for the event
 * @version 1.2
 **/

export interface CreateEventActivationParams extends MutationParams {
  eventId: string;
  activation: EventActivationCreateInputs;
}

export const CreateEventActivation = async ({
  eventId,
  activation,
  adminApiParams,
  queryClient,
}: CreateEventActivationParams): Promise<
  ConnectedXMResponse<EventActivation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<EventActivation>>(
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
  >(CreateEventActivation, options, {
    domain: "events",
    type: "update",
  });
};