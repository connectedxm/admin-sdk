import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { Track } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_TRACKS_QUERY_KEY } from "@context/queries/events/tracks/useGetEventTracks";
import { SET_EVENT_TRACK_QUERY_DATA } from "@context/queries/events/tracks/useGetEventTrack";

interface CreateEventTrackParams {
  eventId: string;
  track: Track;
}

export const CreateEventTrack = async ({
  eventId,
  track,
}: CreateEventTrackParams): Promise<ConnectedXMResponse<Track>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(`/events/${eventId}/tracks`, track);
  return data;
};

export const useCreateEventTrack = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<Track>(
    (track: Track) => CreateEventTrack({ eventId, track }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof CreateEventTrack>>) => {
        queryClient.invalidateQueries(EVENT_TRACKS_QUERY_KEY(eventId));
        SET_EVENT_TRACK_QUERY_DATA(
          queryClient,
          [eventId, response.data.id],
          response
        );
      },
    }
  );
};

export default useCreateEventTrack;
