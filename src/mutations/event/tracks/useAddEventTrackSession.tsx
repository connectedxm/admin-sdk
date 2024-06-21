import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Track } from "@interfaces";
import { EVENT_TRACK_SESSIONS_QUERY_KEY } from "@context/queries/events/tracks/useGetEventTrackSessions";
import { SET_EVENT_TRACK_QUERY_DATA } from "@context/queries/events/tracks/useGetEventTrack";

interface AddEventTrackSessionParams {
  eventId: string;
  trackId: string;
  sessionId: string;
}

export const AddEventTrackSession = async ({
  eventId,
  trackId,
  sessionId,
}: AddEventTrackSessionParams): Promise<ConnectedXMResponse<Track>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/tracks/${trackId}/sessions/${sessionId}`
  );
  return data;
};

export const useAddEventTrackSession = (eventId: string, trackId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (sessionId: string) =>
      AddEventTrackSession({ eventId, trackId, sessionId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof AddEventTrackSession>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_TRACK_SESSIONS_QUERY_KEY(eventId, trackId)
        );
        SET_EVENT_TRACK_QUERY_DATA(queryClient, [eventId, trackId], response);
      },
    }
  );
};

export default useAddEventTrackSession;
