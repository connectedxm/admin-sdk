import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Session } from "@interfaces";
import { EVENT_SESSION_ACCOUNTS_QUERY_KEY } from "@context/queries/events/sessions/useGetEventSessionAccounts";
import { SET_EVENT_SESSION_QUERY_DATA } from "@context/queries/events/sessions/useGetEventSession";

interface RemoveEventSessionAccountParams {
  eventId: string;
  sessionId: string;
  accountId: string;
}

export const RemoveEventSessionAccount = async ({
  eventId,
  sessionId,
  accountId,
}: RemoveEventSessionAccountParams): Promise<ConnectedXMResponse<Session>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/sessions/${sessionId}/accounts/${accountId}`
  );
  return data;
};

export const useRemoveEventSessionAccount = (
  eventId: string,
  sessionId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (accountId: string) =>
      RemoveEventSessionAccount({ eventId, sessionId, accountId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof RemoveEventSessionAccount>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_SESSION_ACCOUNTS_QUERY_KEY(eventId, sessionId)
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

export default useRemoveEventSessionAccount;
