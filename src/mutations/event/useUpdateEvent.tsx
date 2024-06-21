import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { Event } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENTS_QUERY_KEY } from "@context/queries/events/useGetEvents";
import { SET_EVENT_QUERY_DATA } from "@context/queries/events/useGetEvent";

interface UpdateEventParams {
  eventId: string;
  event: Event;
}

export const UpdateEvent = async ({
  eventId,
  event,
}: UpdateEventParams): Promise<ConnectedXMResponse<Event>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(`/events/${eventId}`, event);
  return data;
};

export const useUpdateEvent = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<Event>(
    (event: Event) => UpdateEvent({ eventId, event }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof UpdateEvent>>) => {
        queryClient.invalidateQueries(EVENTS_QUERY_KEY());
        SET_EVENT_QUERY_DATA(queryClient, [response.data?.id], response);
      },
    }
  );
};

export default useUpdateEvent;
