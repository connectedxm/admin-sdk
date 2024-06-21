import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { Speaker } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_SPEAKERS_QUERY_KEY } from "@context/queries/events/speakers/useGetEventSpeakers";
import { SET_EVENT_SPEAKER_QUERY_DATA } from "@context/queries/events/speakers/useGetEventSpeaker";

interface CreateEventSpeakerParams {
  eventId: string;
  speaker: Speaker;
}

export const CreateEventSpeaker = async ({
  eventId,
  speaker,
}: CreateEventSpeakerParams): Promise<ConnectedXMResponse<Speaker>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/speakers`,
    speaker
  );
  return data;
};

export const useCreateEventSpeaker = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<Speaker>(
    (speaker: Speaker) => CreateEventSpeaker({ eventId, speaker }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof CreateEventSpeaker>>) => {
        queryClient.invalidateQueries(EVENT_SPEAKERS_QUERY_KEY(eventId));
        SET_EVENT_SPEAKER_QUERY_DATA(
          queryClient,
          [eventId, response.data.id],
          response
        );
      },
    }
  );
};

export default useCreateEventSpeaker;
