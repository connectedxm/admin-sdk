import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { EVENT_TRACKS_QUERY_KEY } from "@context/queries/events/tracks/useGetEventTracks";
import { EVENT_TRACK_QUERY_KEY } from "@context/queries/events/tracks/useGetEventTrack";

interface DeleteEventTrackParams {
  eventId: string;
  trackId: string;
}

export const DeleteEventTrack = async ({
  eventId,
  trackId,
}: DeleteEventTrackParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/tracks/${trackId}`
  );
  return data;
};

export const useDeleteEventTrack = (eventId: string, trackId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useConnectedMutation(() => DeleteEventTrack({ eventId, trackId }), {
    onSuccess: async (
      _response: Awaited<ReturnType<typeof DeleteEventTrack>>
    ) => {
      await router.push(`/events/${eventId}/agenda/tracks`);
      queryClient.invalidateQueries(EVENT_TRACKS_QUERY_KEY(eventId));
      queryClient.removeQueries(EVENT_TRACK_QUERY_KEY(eventId, trackId));
    },
  });
};

export default useDeleteEventTrack;
