import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { SET_EVENT_SESSION_QUERY_DATA } from "@context/queries/events/sessions/useGetEventSession";
import { EVENT_SESSION_TRACKS_QUERY_KEY } from "@context/queries/events/sessions/useGetEventSessionTracks";
import { Session } from "@interfaces";

interface AddEventSessionTrackParams {
  eventId: string;
  sessionId: string;
  trackId: string;
}

export const AddEventSessionTrack = async ({
  eventId,
  sessionId,
  trackId,
}: AddEventSessionTrackParams): Promise<ConnectedXMResponse<Session>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/sessions/${sessionId}/tracks/${trackId}`
  );
  return data;
};

export const useAddEventSessionTrack = (eventId: string, sessionId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (trackId: string) => AddEventSessionTrack({ eventId, sessionId, trackId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof AddEventSessionTrack>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_SESSION_TRACKS_QUERY_KEY(eventId, sessionId)
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

export default useAddEventSessionTrack;
