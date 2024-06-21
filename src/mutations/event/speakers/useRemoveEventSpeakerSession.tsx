import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Speaker } from "@interfaces";
import { EVENT_SPEAKER_SESSIONS_QUERY_KEY } from "@context/queries/events/speakers/useGetEventSpeakerSessions";
import { SET_EVENT_SPEAKER_QUERY_DATA } from "@context/queries/events/speakers/useGetEventSpeaker";

interface RemoveEventSpeakerSessionParams {
  eventId: string;
  speakerId: string;
  sessionId: string;
}

export const RemoveEventSpeakerSession = async ({
  eventId,
  speakerId,
  sessionId,
}: RemoveEventSpeakerSessionParams): Promise<ConnectedXMResponse<Speaker>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/speakers/${speakerId}/sessions/${sessionId}`
  );
  return data;
};

export const useRemoveEventSpeakerSession = (
  eventId: string,
  speakerId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (sessionId: string) =>
      RemoveEventSpeakerSession({ eventId, speakerId, sessionId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof RemoveEventSpeakerSession>>
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
    },
    undefined,
    true
  );
};

export default useRemoveEventSpeakerSession;
