import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { Event } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENTS_QUERY_KEY } from "@context/queries/events/useGetEvents";
import { SET_EVENT_QUERY_DATA } from "@context/queries/events/useGetEvent";

interface CreateEventParams {
  event: Event;
}

export const CreateEvent = async ({
  event,
}: CreateEventParams): Promise<ConnectedXMResponse<Event>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(`/events`, event);
  return data;
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useConnectedMutation<Event>((event: Event) => CreateEvent({ event }), {
    onSuccess: (response: Awaited<ReturnType<typeof CreateEvent>>) => {
      queryClient.invalidateQueries(EVENTS_QUERY_KEY());
      SET_EVENT_QUERY_DATA(queryClient, [response.data?.id], response);
    },
  });
};

export default useCreateEvent;
