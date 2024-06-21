import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { Track } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_TRACKS_QUERY_KEY } from "@context/queries/events/tracks/useGetEventTracks";
import { SET_EVENT_TRACK_QUERY_DATA } from "@context/queries/events/tracks/useGetEventTrack";

interface UpdateEventTrackParams {
  eventId: string;
  trackId: string;
  track: Track;
}

export const UpdateEventTrack = async ({
  eventId,
  trackId,
  track,
}: UpdateEventTrackParams): Promise<ConnectedXMResponse<Track>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/events/${eventId}/tracks/${trackId}`,
    track
  );
  return data;
};

export const useUpdateEventTrack = (eventId: string, trackId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<Track>(
    (track: Track) => UpdateEventTrack({ eventId, trackId, track }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof UpdateEventTrack>>) => {
        queryClient.invalidateQueries(EVENT_TRACKS_QUERY_KEY(eventId));
        SET_EVENT_TRACK_QUERY_DATA(queryClient, [eventId, trackId], response);
      },
    }
  );
};

export default useUpdateEventTrack;
