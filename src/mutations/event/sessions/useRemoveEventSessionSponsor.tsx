import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Session } from "@interfaces";
import { SET_EVENT_SESSION_QUERY_DATA } from "@context/queries/events/sessions/useGetEventSession";
import { EVENT_SESSION_SPONSORS_QUERY_KEY } from "@context/queries/events/sessions/useGetEventSessionSponsors";

interface RemoveEventSessionSponsorParams {
  eventId: string;
  sessionId: string;
  sponsorId: string;
}

export const RemoveEventSessionSponsor = async ({
  eventId,
  sessionId,
  sponsorId,
}: RemoveEventSessionSponsorParams): Promise<ConnectedXMResponse<Session>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/sessions/${sessionId}/sponsors/${sponsorId}`
  );
  return data;
};

export const useRemoveEventSessionSponsor = (
  eventId: string,
  sessionId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (sponsorId: string) =>
      RemoveEventSessionSponsor({ eventId, sessionId, sponsorId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof RemoveEventSessionSponsor>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_SESSION_SPONSORS_QUERY_KEY(eventId, sessionId)
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

export default useRemoveEventSessionSponsor;
