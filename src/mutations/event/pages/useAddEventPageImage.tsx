import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { SET_EVENT_PAGE_QUERY_DATA } from "@context/queries/events/pages/useGetEventPage";
import { EVENT_PAGE_IMAGES_QUERY_KEY } from "@context/queries/events/pages/useGetEventPageImages";
import { EventPage } from "@interfaces";

interface AddEventPageImageParams {
  eventId: string;
  pageId: string;
  imageId: string;
}

export const AddEventPageImage = async ({
  eventId,
  pageId,
  imageId,
}: AddEventPageImageParams): Promise<ConnectedXMResponse<EventPage>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/pages/${pageId}/images/${imageId}`
  );
  return data;
};

export const useAddEventPageImage = (eventId: string, pageId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (imageId: string) => AddEventPageImage({ eventId, pageId, imageId }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof AddEventPageImage>>) => {
        queryClient.invalidateQueries(
          EVENT_PAGE_IMAGES_QUERY_KEY(eventId, pageId)
        );
        SET_EVENT_PAGE_QUERY_DATA(queryClient, [eventId, pageId], response);
      },
    }
  );
};

export default useAddEventPageImage;
