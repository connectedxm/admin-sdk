import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { Speaker } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_SPEAKERS_QUERY_KEY } from "@context/queries/events/speakers/useGetEventSpeakers";
import { SET_EVENT_SPEAKER_QUERY_DATA } from "@context/queries/events/speakers/useGetEventSpeaker";

interface UpdateEventSpeakerParams {
  eventId: string;
  speakerId: string;
  speaker: Speaker;
}

export const UpdateEventSpeaker = async ({
  eventId,
  speakerId,
  speaker,
}: UpdateEventSpeakerParams): Promise<ConnectedXMResponse<Speaker>> => {
  if (!speakerId) throw new Error("speakerId is required");
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/events/${eventId}/speakers/${speakerId}`,
    {
      ...speaker,
      id: undefined,
      eventId: undefined,
      event: undefined,
      fullName: undefined,
      image: undefined,
      sessions: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
  );
  return data;
};

export const useUpdateEventSpeaker = (eventId: string, speakerId?: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<Speaker>(
    (speaker: Speaker) =>
      UpdateEventSpeaker({
        eventId,
        speakerId: speakerId || speaker.id,
        speaker,
      }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof UpdateEventSpeaker>>) => {
        queryClient.invalidateQueries(EVENT_SPEAKERS_QUERY_KEY(eventId));
        SET_EVENT_SPEAKER_QUERY_DATA(
          queryClient,
          [eventId, speakerId || response.data.id],
          response
        );
      },
    }
  );
};

export default useUpdateEventSpeaker;
