import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { SET_EVENT_TRACK_QUERY_DATA } from "@context/queries/events/tracks/useGetEventTrack";
import { EVENT_TRACK_SPONSORS_QUERY_KEY } from "@context/queries/events/tracks/useGetEventTrackSponsors";
import { Track } from "@interfaces";

interface AddEventTrackSponsorParams {
  eventId: string;
  trackId: string;
  sponsorId: string;
}

export const AddEventTrackSponsor = async ({
  eventId,
  trackId,
  sponsorId,
}: AddEventTrackSponsorParams): Promise<ConnectedXMResponse<Track>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/tracks/${trackId}/sponsors/${sponsorId}`
  );
  return data;
};

export const useAddEventTrackSponsor = (eventId: string, trackId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (sponsorId: string) =>
      AddEventTrackSponsor({ eventId, trackId, sponsorId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof AddEventTrackSponsor>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_TRACK_SPONSORS_QUERY_KEY(eventId, trackId)
        );
        SET_EVENT_TRACK_QUERY_DATA(queryClient, [eventId, trackId], response);
      },
    }
  );
};

export default useAddEventTrackSponsor;
