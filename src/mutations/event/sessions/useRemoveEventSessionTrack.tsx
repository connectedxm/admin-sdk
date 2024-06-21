import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Session } from "@interfaces";
import { EVENT_SESSION_TRACKS_QUERY_KEY } from "@context/queries/events/sessions/useGetEventSessionTracks";
import { SET_EVENT_SESSION_QUERY_DATA } from "@context/queries/events/sessions/useGetEventSession";

interface RemoveEventSessionTrackParams {
  eventId: string;
  sessionId: string;
  trackId: string;
}

export const RemoveEventSessionTrack = async ({
  eventId,
  sessionId,
  trackId,
}: RemoveEventSessionTrackParams): Promise<ConnectedXMResponse<Session>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/sessions/${sessionId}/tracks/${trackId}`
  );
  return data;
};

export const useRemoveEventSessionTrack = (
  eventId: string,
  sessionId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (trackId: string) =>
      RemoveEventSessionTrack({ eventId, sessionId, trackId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof RemoveEventSessionTrack>>
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
    },
    undefined,
    true
  );
};

export default useRemoveEventSessionTrack;
