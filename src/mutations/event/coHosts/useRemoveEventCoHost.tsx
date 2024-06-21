import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Account } from "@interfaces";
import { EVENT_CO_HOSTS_QUERY_KEY } from "@context/queries/events/coHosts/useGetEventCoHosts";

interface RemoveEventCoHostParams {
  eventId: string;
  accountId: string;
}

export const RemoveEventCoHost = async ({
  eventId,
  accountId,
}: RemoveEventCoHostParams): Promise<ConnectedXMResponse<Account>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/coHosts/${accountId}`
  );
  return data;
};

export const useRemoveEventCoHost = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (accountId: string) => RemoveEventCoHost({ eventId, accountId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(EVENT_CO_HOSTS_QUERY_KEY(eventId));
      },
    },
    undefined,
    true
  );
};

export default useRemoveEventCoHost;
