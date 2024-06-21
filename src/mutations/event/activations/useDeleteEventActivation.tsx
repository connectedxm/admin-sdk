import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { EVENT_ACTIVATIONS_QUERY_KEY } from "@context/queries/events/activations/useGetEventActivations";
import { EVENT_ACTIVATION_QUERY_KEY } from "@context/queries/events/activations/useGetEventActivation";

interface DeleteEventActivationParams {
  eventId: string;
  activationId: string;
}

export const DeleteEventActivation = async ({
  eventId,
  activationId,
}: DeleteEventActivationParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/activations/${activationId}`
  );
  return data;
};

export const useDeleteEventActivation = (
  eventId: string,
  activationId: string
) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useConnectedMutation(
    () => DeleteEventActivation({ eventId, activationId }),
    {
      onSuccess: async (
        _response: Awaited<ReturnType<typeof DeleteEventActivation>>
      ) => {
        await router.push(`/events/${eventId}/activations`);
        queryClient.invalidateQueries(EVENT_ACTIVATIONS_QUERY_KEY(eventId));
        queryClient.removeQueries(
          EVENT_ACTIVATION_QUERY_KEY(eventId, activationId)
        );
      },
    }
  );
};

export default useDeleteEventActivation;
