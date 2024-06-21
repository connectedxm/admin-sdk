import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { EventActivation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_ACTIVATIONS_QUERY_KEY } from "@context/queries/events/activations/useGetEventActivations";
import { SET_EVENT_ACTIVATION_QUERY_DATA } from "@context/queries/events/activations/useGetEventActivation";

interface CreateEventActivationParams {
  eventId: string;
  activation: EventActivation;
}

export const CreateEventActivation = async ({
  eventId,
  activation,
}: CreateEventActivationParams): Promise<
  ConnectedXMResponse<EventActivation>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/activations`,
    activation
  );
  return data;
};

export const useCreateEventActivation = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<EventActivation>(
    (activation: EventActivation) =>
      CreateEventActivation({ eventId, activation }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof CreateEventActivation>>
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

export default useCreateEventActivation;
