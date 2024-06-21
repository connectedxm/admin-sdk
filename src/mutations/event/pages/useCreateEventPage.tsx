import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { EventPage } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_PAGES_QUERY_KEY } from "@context/queries/events/pages/useGetEventPages";
import { SET_EVENT_PAGE_QUERY_DATA } from "@context/queries/events/pages/useGetEventPage";

interface CreateEventPageParams {
  eventId: string;
  page: EventPage;
}

export const CreateEventPage = async ({
  eventId,
  page,
}: CreateEventPageParams): Promise<ConnectedXMResponse<EventPage>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(`/events/${eventId}/pages`, page);
  return data;
};

export const useCreateEventPage = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<EventPage>(
    (page: EventPage) => CreateEventPage({ eventId, page }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof CreateEventPage>>) => {
        queryClient.invalidateQueries(EVENT_PAGES_QUERY_KEY(eventId));
        SET_EVENT_PAGE_QUERY_DATA(
          queryClient,
          [eventId, response.data.id],
          response
        );
      },
    }
  );
};

export default useCreateEventPage;
