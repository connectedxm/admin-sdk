import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_SPONSORSHIPS_QUERY_KEY } from "@context/queries/events/sponsors/useGetEventSponsorships";
import { Event } from "@interfaces";
import { SET_EVENT_QUERY_DATA } from "@context/queries/events/useGetEvent";

interface AddEventSponsorshipParams {
  eventId: string;
  sponsorshipId: string;
}

export const AddEventSponsorship = async ({
  eventId,
  sponsorshipId,
}: AddEventSponsorshipParams): Promise<ConnectedXMResponse<Event>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/sponsors/sponsorships/${sponsorshipId}`
  );
  return data;
};

export const useAddEventSponsorship = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (sponsorshipId: string) => AddEventSponsorship({ eventId, sponsorshipId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof AddEventSponsorship>>
      ) => {
        queryClient.invalidateQueries(EVENT_SPONSORSHIPS_QUERY_KEY(eventId));
        SET_EVENT_QUERY_DATA(queryClient, [eventId], response);
      },
    }
  );
};

export default useAddEventSponsorship;
