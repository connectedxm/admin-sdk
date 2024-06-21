import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { EVENT_SESSION_QUERY_KEY } from "@context/queries/events/sessions/useGetEventSession";
import { EVENT_SESSIONS_QUERY_KEY } from "@context/queries/events/sessions/useGetEventSessions";

interface DeleteEventSessionParams {
  eventId: string;
  sessionId: string;
}

export const DeleteEventSession = async ({
  eventId,
  sessionId,
}: DeleteEventSessionParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/sessions/${sessionId}`
  );
  return data;
};

export const useDeleteEventSession = (eventId: string, sessionId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useConnectedMutation(
    () => DeleteEventSession({ eventId, sessionId }),
    {
      onSuccess: async (
        _response: Awaited<ReturnType<typeof DeleteEventSession>>
      ) => {
        await router.push(`/events/${eventId}/agenda/sessions`);
        queryClient.invalidateQueries(EVENT_SESSIONS_QUERY_KEY(eventId));
        queryClient.removeQueries(EVENT_SESSION_QUERY_KEY(eventId, sessionId));
      },
    }
  );
};

export default useDeleteEventSession;
