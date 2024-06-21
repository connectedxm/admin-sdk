import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { EventPage } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_PAGES_QUERY_KEY } from "@context/queries/events/pages/useGetEventPages";
import { SET_EVENT_PAGE_QUERY_DATA } from "@context/queries/events/pages/useGetEventPage";

interface UpdateEventPageParams {
  eventId: string;
  pageId: string;
  page: EventPage;
}

export const UpdateEventPage = async ({
  eventId,
  pageId,
  page,
}: UpdateEventPageParams): Promise<ConnectedXMResponse<EventPage>> => {
  if (!pageId) throw new Error("Page ID Undefined");
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(`/events/${eventId}/pages/${pageId}`, {
    ...page,
    id: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  });
  return data;
};

export const useUpdateEventPage = (eventId: string, pageId?: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<EventPage>(
    (page: EventPage) =>
      UpdateEventPage({ eventId, pageId: pageId || page?.id, page }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof UpdateEventPage>>) => {
        queryClient.invalidateQueries(EVENT_PAGES_QUERY_KEY(eventId));
        SET_EVENT_PAGE_QUERY_DATA(
          queryClient,
          [eventId, pageId || response.data?.id],
          response
        );
      },
    }
  );
};

export default useUpdateEventPage;
