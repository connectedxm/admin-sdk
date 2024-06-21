import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Session } from "@interfaces";
import { EVENT_SESSION_SPEAKERS_QUERY_KEY } from "@context/queries/events/sessions/useGetEventSessionSpeakers";
import { SET_EVENT_SESSION_QUERY_DATA } from "@context/queries/events/sessions/useGetEventSession";

interface AddEventSessionSpeakerParams {
  eventId: string;
  sessionId: string;
  speakerId: string;
}

export const AddEventSessionSpeaker = async ({
  eventId,
  sessionId,
  speakerId,
}: AddEventSessionSpeakerParams): Promise<ConnectedXMResponse<Session>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/sessions/${sessionId}/speakers/${speakerId}`
  );
  return data;
};

export const useAddEventSessionSpeaker = (
  eventId: string,
  sessionId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (speakerId: string) =>
      AddEventSessionSpeaker({ eventId, sessionId, speakerId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof AddEventSessionSpeaker>>
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
    }
  );
};

export default useAddEventSessionSpeaker;
