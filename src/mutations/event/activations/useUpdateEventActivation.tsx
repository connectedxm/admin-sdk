import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { EventActivation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_ACTIVATIONS_QUERY_KEY } from "@context/queries/events/activations/useGetEventActivations";
import { SET_EVENT_ACTIVATION_QUERY_DATA } from "@context/queries/events/activations/useGetEventActivation";

interface UpdateEventActivationParams {
  eventId: string;
  activationId: string;
  activation: EventActivation;
}

export const UpdateEventActivation = async ({
  eventId,
  activationId,
  activation,
}: UpdateEventActivationParams): Promise<
  ConnectedXMResponse<EventActivation>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/events/${eventId}/activations/${activationId}`,
    activation
  );
  return data;
};

export const useUpdateEventActivation = (
  eventId: string,
  activationId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<EventActivation>(
    (activation: EventActivation) =>
      UpdateEventActivation({ eventId, activationId, activation }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof UpdateEventActivation>>
      ) => {
        queryClient.invalidateQueries(EVENT_ACTIVATIONS_QUERY_KEY(eventId));
        SET_EVENT_ACTIVATION_QUERY_DATA(
          queryClient,
          [eventId, response.data.id],
          response
        );
      },
    }
  );
};

export default useUpdateEventActivation;
