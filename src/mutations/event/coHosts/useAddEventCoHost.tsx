import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Account } from "@interfaces";
import { EVENT_CO_HOSTS_QUERY_KEY } from "@context/queries/events/coHosts/useGetEventCoHosts";

interface AddEventCoHostParams {
  eventId: string;
  accountId: string;
}

export const AddEventCoHost = async ({
  eventId,
  accountId,
}: AddEventCoHostParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/coHosts/${accountId}`
  );
  return data;
};

export const useAddEventCoHost = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (accountId: string) => AddEventCoHost({ eventId, accountId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(EVENT_CO_HOSTS_QUERY_KEY(eventId));
      },
    }
  );
};

export default useAddEventCoHost;
