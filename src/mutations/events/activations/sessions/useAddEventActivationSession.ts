import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventActivation } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ACTIVATION_SESSIONS_QUERY_KEY,
  SET_EVENT_ACTIVATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Activations
 */
export interface AddEventActivationSessionParams extends MutationParams {
  eventId: string;
  activationId: string;
  sessionId: string;
}

/**
 * @category Methods
 * @group Event-Activations
 */
export const AddEventActivationSession = async ({
  eventId,
  activationId,
  sessionId,
  adminApiParams,
  queryClient,
}: AddEventActivationSessionParams): Promise<
  ConnectedXMResponse<EventActivation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventActivation>>(
    `/events/${eventId}/activations/${activationId}/sessions/${sessionId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ACTIVATION_SESSIONS_QUERY_KEY(eventId, activationId),
    });
    SET_EVENT_ACTIVATION_QUERY_DATA(queryClient, [eventId, activationId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Activations
 */
export const useAddEventActivationSession = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventActivationSession>>,
      Omit<AddEventActivationSessionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventActivationSessionParams,
    Awaited<ReturnType<typeof AddEventActivationSession>>
  >(AddEventActivationSession, options);
};
