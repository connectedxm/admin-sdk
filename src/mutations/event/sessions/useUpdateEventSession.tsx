import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { Session } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_SESSIONS_QUERY_KEY } from "@context/queries/events/sessions/useGetEventSessions";
import { SET_EVENT_SESSION_QUERY_DATA } from "@context/queries/events/sessions/useGetEventSession";

interface UpdateEventSessionParams {
  eventId: string;
  sessionId: string;
  session: Session;
}

export const UpdateEventSession = async ({
  eventId,
  sessionId,
  session,
}: UpdateEventSessionParams): Promise<ConnectedXMResponse<Session>> => {
  if (!sessionId) throw new Error("Session ID Undefined");
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/events/${eventId}/sessions/${sessionId}`,
    {
      ...session,
      id: undefined,
      eventId: undefined,
      event: undefined,
      image: undefined,
      tracks: undefined,
      speakers: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
  );
  return data;
};

export const useUpdateEventSession = (eventId: string, sessionId?: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<Session>(
    (session: Session) =>
      UpdateEventSession({
        eventId,
        sessionId: sessionId || session.id,
        session,
      }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof UpdateEventSession>>) => {
        queryClient.invalidateQueries(EVENT_SESSIONS_QUERY_KEY(eventId));
        SET_EVENT_SESSION_QUERY_DATA(
          queryClient,
          [eventId, sessionId || response.data?.id],
          response
        );
      },
    }
  );
};

export default useUpdateEventSession;
