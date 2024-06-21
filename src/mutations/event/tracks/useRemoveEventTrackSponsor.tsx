import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Track } from "@interfaces";
import { SET_EVENT_TRACK_QUERY_DATA } from "@context/queries/events/tracks/useGetEventTrack";
import { EVENT_TRACK_SPONSORS_QUERY_KEY } from "@context/queries/events/tracks/useGetEventTrackSponsors";

interface RemoveEventTrackSponsorParams {
  eventId: string;
  trackId: string;
  sponsorId: string;
}

export const RemoveEventTrackSponsor = async ({
  eventId,
  trackId,
  sponsorId,
}: RemoveEventTrackSponsorParams): Promise<ConnectedXMResponse<Track>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/tracks/${trackId}/sponsors/${sponsorId}`
  );
  return data;
};

export const useRemoveEventTrackSponsor = (
  eventId: string,
  trackId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (sponsorId: string) =>
      RemoveEventTrackSponsor({ eventId, trackId, sponsorId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof RemoveEventTrackSponsor>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_TRACK_SPONSORS_QUERY_KEY(eventId, trackId)
        );
        SET_EVENT_TRACK_QUERY_DATA(queryClient, [eventId, trackId], response);
      },
    },
    undefined,
    true
  );
};

export default useRemoveEventTrackSponsor;
