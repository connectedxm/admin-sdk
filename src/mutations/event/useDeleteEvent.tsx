import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { EVENTS_QUERY_KEY } from "@context/queries/events/useGetEvents";
import { EVENT_QUERY_KEY } from "@context/queries/events/useGetEvent";

interface DeleteEventParams {
  eventId: string;
}

export const DeleteEvent = async ({
  eventId,
}: DeleteEventParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(`/events/${eventId}`);
  return data;
};

export const useDeleteEvent = (eventId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useConnectedMutation(() => DeleteEvent({ eventId }), {
    onSuccess: async (_response: Awaited<ReturnType<typeof DeleteEvent>>) => {
      await router.push(`/events`);
      queryClient.invalidateQueries(EVENTS_QUERY_KEY());
      queryClient.removeQueries(EVENT_QUERY_KEY(eventId));
    },
  });
};

export default useDeleteEvent;
