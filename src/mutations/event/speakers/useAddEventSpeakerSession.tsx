import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Speaker } from "@interfaces";
import { EVENT_SPEAKER_SESSIONS_QUERY_KEY } from "@context/queries/events/speakers/useGetEventSpeakerSessions";
import { SET_EVENT_SPEAKER_QUERY_DATA } from "@context/queries/events/speakers/useGetEventSpeaker";

interface AddEventSpeakerSessionParams {
  eventId: string;
  speakerId: string;
  sessionId: string;
}

export const AddEventSpeakerSession = async ({
  eventId,
  speakerId,
  sessionId,
}: AddEventSpeakerSessionParams): Promise<ConnectedXMResponse<Speaker>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/speakers/${speakerId}/sessions/${sessionId}`
  );
  return data;
};

export const useAddEventSpeakerSession = (
  eventId: string,
  speakerId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (sessionId: string) =>
      AddEventSpeakerSession({ eventId, speakerId, sessionId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof AddEventSpeakerSession>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_SPEAKER_SESSIONS_QUERY_KEY(eventId, speakerId)
        );
        SET_EVENT_SPEAKER_QUERY_DATA(
          queryClient,
          [eventId, speakerId],
          response
        );
      },
    }
  );
};

export default useAddEventSpeakerSession;
