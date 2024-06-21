import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { EVENT_PAGES_QUERY_KEY } from "@context/queries/events/pages/useGetEventPages";
import { EVENT_PAGE_QUERY_KEY } from "@context/queries/events/pages/useGetEventPage";

interface DeleteEventPageParams {
  eventId: string;
  pageId: string;
}

export const DeleteEventPage = async ({
  eventId,
  pageId,
}: DeleteEventPageParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/pages/${pageId}`
  );
  return data;
};

export const useDeleteEventPage = (eventId: string, pageId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useConnectedMutation(() => DeleteEventPage({ eventId, pageId }), {
    onSuccess: async (
      _response: Awaited<ReturnType<typeof DeleteEventPage>>
    ) => {
      await router.push(`/events/${eventId}/pages`);
      queryClient.invalidateQueries(EVENT_PAGES_QUERY_KEY(eventId));
      queryClient.removeQueries(EVENT_PAGE_QUERY_KEY(eventId, pageId));
    },
  });
};

export default useDeleteEventPage;
