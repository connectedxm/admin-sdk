import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { SET_EVENT_QUERY_DATA } from "@queries/events/useGetEvent";
import { EVENT_SPONSORS_QUERY_KEY } from "@context/queries/events/sponsors/useGetEventSponsors";
import { Event } from "@interfaces";

interface RemoveEventSponsorAccountParams {
  eventId: string;
  accountId: string;
}

export const RemoveEventSponsorAccount = async ({
  eventId,
  accountId,
}: RemoveEventSponsorAccountParams): Promise<ConnectedXMResponse<Event>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/sponsors/accounts/${accountId}`
  );
  return data;
};

export const useRemoveEventSponsorAccount = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (accountId: string) => RemoveEventSponsorAccount({ eventId, accountId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof RemoveEventSponsorAccount>>
      ) => {
        queryClient.invalidateQueries(EVENT_SPONSORS_QUERY_KEY(eventId));
        SET_EVENT_QUERY_DATA(queryClient, [eventId], response);
      },
    },
    undefined,
    true
  );
};

export default useRemoveEventSponsorAccount;
