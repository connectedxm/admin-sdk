import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { EventPage } from "@interfaces";
import { SET_EVENT_PAGE_QUERY_DATA } from "@context/queries/events/pages/useGetEventPage";
import { EVENT_PAGE_IMAGES_QUERY_KEY } from "@context/queries/events/pages/useGetEventPageImages";

interface RemoveEventPageImageParams {
  eventId: string;
  pageId: string;
  imageId: string;
}

export const RemoveEventPageImage = async ({
  eventId,
  pageId,
  imageId,
}: RemoveEventPageImageParams): Promise<ConnectedXMResponse<EventPage>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/pages/${pageId}/images/${imageId}`
  );
  return data;
};

export const useRemoveEventPageImage = (eventId: string, pageId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (imageId: string) => RemoveEventPageImage({ eventId, pageId, imageId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof RemoveEventPageImage>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_PAGE_IMAGES_QUERY_KEY(eventId, pageId)
        );
        SET_EVENT_PAGE_QUERY_DATA(queryClient, [eventId, pageId], response);
      },
    },
    undefined,
    true
  );
};

export default useRemoveEventPageImage;
