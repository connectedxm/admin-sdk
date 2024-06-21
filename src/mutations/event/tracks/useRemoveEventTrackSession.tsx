import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_TRACK_SESSIONS_QUERY_KEY } from "@context/queries/events/tracks/useGetEventTrackSessions";
import { Track } from "@interfaces";
import { SET_EVENT_TRACK_QUERY_DATA } from "@context/queries/events/tracks/useGetEventTrack";

interface RemoveEventTrackSessionParams {
  eventId: string;
  trackId: string;
  sessionId: string;
}

export const RemoveEventTrackSession = async ({
  eventId,
  trackId,
  sessionId,
}: RemoveEventTrackSessionParams): Promise<ConnectedXMResponse<Track>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/tracks/${trackId}/sessions/${sessionId}`
  );
  return data;
};

export const useRemoveEventTrackSession = (
  eventId: string,
  trackId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (sessionId: string) =>
      RemoveEventTrackSession({ eventId, trackId, sessionId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof RemoveEventTrackSession>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_TRACK_SESSIONS_QUERY_KEY(eventId, trackId)
        );
        SET_EVENT_TRACK_QUERY_DATA(queryClient, [eventId, trackId], response);
      },
    },
    undefined,
    true
  );
};

export default useRemoveEventTrackSession;
