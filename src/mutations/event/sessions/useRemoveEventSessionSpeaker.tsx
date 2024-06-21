import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Session } from "@interfaces";
import { SET_EVENT_SESSION_QUERY_DATA } from "@context/queries/events/sessions/useGetEventSession";
import { EVENT_SESSION_SPEAKERS_QUERY_KEY } from "@context/queries/events/sessions/useGetEventSessionSpeakers";

interface RemoveEventSessionSpeakerParams {
  eventId: string;
  sessionId: string;
  speakerId: string;
}

export const RemoveEventSessionSpeaker = async ({
  eventId,
  sessionId,
  speakerId,
}: RemoveEventSessionSpeakerParams): Promise<ConnectedXMResponse<Session>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/sessions/${sessionId}/speakers/${speakerId}`
  );
  return data;
};

export const useRemoveEventSessionSpeaker = (
  eventId: string,
  sessionId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (speakerId: string) =>
      RemoveEventSessionSpeaker({ eventId, sessionId, speakerId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof RemoveEventSessionSpeaker>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_SESSION_SPEAKERS_QUERY_KEY(eventId, sessionId)
        );
        SET_EVENT_SESSION_QUERY_DATA(
          queryClient,
          [eventId, sessionId],
          response
        );
      },
    },
    undefined,
    true
  );
};

export default useRemoveEventSessionSpeaker;
