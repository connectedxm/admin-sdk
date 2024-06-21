import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_SPONSORS_QUERY_KEY } from "@context/queries/events/sponsors/useGetEventSponsors";
import { Event } from "@interfaces";
import { SET_EVENT_QUERY_DATA } from "@context/queries/events/useGetEvent";

interface AddEventSponsorAccountParams {
  eventId: string;
  accountId: string;
}

export const AddEventSponsorAccount = async ({
  eventId,
  accountId,
}: AddEventSponsorAccountParams): Promise<ConnectedXMResponse<Event>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/sponsors/accounts/${accountId}`
  );
  return data;
};

export const useAddEventSponsorAccount = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (accountId: string) => AddEventSponsorAccount({ eventId, accountId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof AddEventSponsorAccount>>
      ) => {
        queryClient.invalidateQueries(EVENT_SPONSORS_QUERY_KEY(eventId));
        SET_EVENT_QUERY_DATA(queryClient, [eventId], response);
      },
    }
  );
};

export default useAddEventSponsorAccount;
