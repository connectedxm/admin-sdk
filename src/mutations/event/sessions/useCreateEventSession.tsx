import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { Session } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_SESSIONS_QUERY_KEY } from "@context/queries/events/sessions/useGetEventSessions";
import { SET_EVENT_SESSION_QUERY_DATA } from "@context/queries/events/sessions/useGetEventSession";

interface CreateEventSessionParams {
  eventId: string;
  session: Session;
}

export const CreateEventSession = async ({
  eventId,
  session,
}: CreateEventSessionParams): Promise<ConnectedXMResponse<Session>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/sessions`,
    session
  );
  return data;
};

export const useCreateEventSession = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<Session>(
    (session: Session) => CreateEventSession({ eventId, session }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof CreateEventSession>>) => {
        queryClient.invalidateQueries(EVENT_SESSIONS_QUERY_KEY(eventId));
        SET_EVENT_SESSION_QUERY_DATA(
          queryClient,
          [eventId, response.data.id],
          response
        );
      },
    }
  );
};

export default useCreateEventSession;
