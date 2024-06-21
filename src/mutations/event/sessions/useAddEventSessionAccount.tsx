import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Session } from "@interfaces";
import { EVENT_SESSION_ACCOUNTS_QUERY_KEY } from "@context/queries/events/sessions/useGetEventSessionAccounts";
import { SET_EVENT_SESSION_QUERY_DATA } from "@context/queries/events/sessions/useGetEventSession";

interface AddEventSessionAccountParams {
  eventId: string;
  sessionId: string;
  accountId: string;
}

export const AddEventSessionAccount = async ({
  eventId,
  sessionId,
  accountId,
}: AddEventSessionAccountParams): Promise<ConnectedXMResponse<Session>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/sessions/${sessionId}/accounts/${accountId}`
  );
  return data;
};

export const useAddEventSessionAccount = (
  eventId: string,
  sessionId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (accountId: string) =>
      AddEventSessionAccount({ eventId, sessionId, accountId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof AddEventSessionAccount>>
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
    }
  );
};

export default useAddEventSessionAccount;
