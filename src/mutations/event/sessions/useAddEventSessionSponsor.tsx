import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { SET_EVENT_SESSION_QUERY_DATA } from "@context/queries/events/sessions/useGetEventSession";
import { EVENT_SESSION_SPONSORS_QUERY_KEY } from "@context/queries/events/sessions/useGetEventSessionSponsors";
import { Session } from "@interfaces";

interface AddEventSessionSponsorParams {
  eventId: string;
  sessionId: string;
  sponsorId: string;
}

export const AddEventSessionSponsor = async ({
  eventId,
  sessionId,
  sponsorId,
}: AddEventSessionSponsorParams): Promise<ConnectedXMResponse<Session>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/sessions/${sessionId}/sponsors/${sponsorId}`
  );
  return data;
};

export const useAddEventSessionSponsor = (
  eventId: string,
  sessionId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (sponsorId: string) =>
      AddEventSessionSponsor({ eventId, sessionId, sponsorId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof AddEventSessionSponsor>>
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
    }
  );
};

export default useAddEventSessionSponsor;
