import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_SPONSORSHIPS_QUERY_KEY } from "@context/queries/events/sponsors/useGetEventSponsorships";
import { SET_EVENT_QUERY_DATA } from "@context/queries/events/useGetEvent";
import { Event } from "@interfaces";

interface RemoveEventSponsorshipParams {
  eventId: string;
  sponsorshipId: string;
}

export const RemoveEventSponsorship = async ({
  eventId,
  sponsorshipId,
}: RemoveEventSponsorshipParams): Promise<ConnectedXMResponse<Event>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/sponsors/sponsorships/${sponsorshipId}`
  );
  return data;
};

export const useRemoveEventSponsorship = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (sponsorshipId: string) =>
      RemoveEventSponsorship({ eventId, sponsorshipId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof RemoveEventSponsorship>>
      ) => {
        queryClient.invalidateQueries(EVENT_SPONSORSHIPS_QUERY_KEY(eventId));
        SET_EVENT_QUERY_DATA(queryClient, [eventId], response);
      },
    },
    undefined,
    true
  );
};

export default useRemoveEventSponsorship;
