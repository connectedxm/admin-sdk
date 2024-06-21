import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_SPEAKER_QUERY_KEY } from "@context/queries/events/speakers/useGetEventSpeaker";
import { EVENT_SPEAKERS_QUERY_KEY } from "@context/queries/events/speakers/useGetEventSpeakers";
import { useRouter } from "next/router";

interface DeleteEventSpeakerParams {
  eventId: string;
  speakerId: string;
}

export const DeleteEventSpeaker = async ({
  eventId,
  speakerId,
}: DeleteEventSpeakerParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/speakers/${speakerId}`
  );
  return data;
};

export const useDeleteEventSpeaker = (eventId: string, speakerId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useConnectedMutation(
    () => DeleteEventSpeaker({ eventId, speakerId }),
    {
      onSuccess: async (
        _response: Awaited<ReturnType<typeof DeleteEventSpeaker>>
      ) => {
        await router.push(`/events/${eventId}/agenda/speakers`);
        queryClient.invalidateQueries(EVENT_SPEAKERS_QUERY_KEY(eventId));
        queryClient.removeQueries(EVENT_SPEAKER_QUERY_KEY(eventId, speakerId));
      },
    }
  );
};

export default useDeleteEventSpeaker;
