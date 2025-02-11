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
 * Updates an event activation by its ID and invalidates the relevant query in the query client.
 * This function is used to modify the details of an existing event activation, ensuring that the
 * query client reflects the latest data by invalidating the cache for the specific event activation.
 * It is designed for applications that manage event activations and require real-time updates.
 * @name UpdateEventActivation
 * @param {string} eventId (path) The id of the event
 * @param {string} activationId (path) The id of the activation
 * @param {EventActivationUpdateInputs} activation (body) The activation update inputs
 * @version 1.3
 **/

export interface UpdateEventActivationParams extends MutationParams {
  eventId: string;
  activationId: string;
  activation: EventActivationUpdateInputs;
}

export const UpdateEventActivation = async ({
  eventId,
  activationId,
  activation,
  adminApiParams,
  queryClient,
}: UpdateEventActivationParams): Promise<
  ConnectedXMResponse<EventActivation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<EventActivation>>(
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
  >(UpdateEventActivation, options, {
    domain: "events",
    type: "update",
  });
};
