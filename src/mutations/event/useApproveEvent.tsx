import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { Event } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { SET_EVENT_QUERY_DATA } from "@queries/events/useGetEvent";
import { EVENTS_QUERY_KEY } from "@queries/events/useGetEvents";
import { UNAPPROVED_EVENTS_QUERY_KEY } from "@queries/events/useGetUnapprovedEvents";

interface ApproveEventParams {
  eventId: string;
}

export const ApproveEvent = async ({
  eventId,
}: ApproveEventParams): Promise<ConnectedXMResponse<Event>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(`/events/${eventId}/approve`);
  return data;
};

export const useApproveEvent = () => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (eventId: string) => ApproveEvent({ eventId }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof ApproveEvent>>) => {
        SET_EVENT_QUERY_DATA(queryClient, [response.data?.id], response);
        queryClient.invalidateQueries(EVENTS_QUERY_KEY());
        queryClient.invalidateQueries(UNAPPROVED_EVENTS_QUERY_KEY());
      },
    },
    "",
    true
  );
};

export default useApproveEvent;
