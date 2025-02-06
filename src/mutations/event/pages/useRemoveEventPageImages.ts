import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPage } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_PAGE_IMAGES_QUERY_KEY,
  SET_EVENT_PAGE_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to remove an image from a specific event page.
 * This function allows the removal of an image associated with a particular event page,
 * identified by the event ID, page ID, and image ID. It ensures that the image is
 * deleted from the event page and updates the query data accordingly.
 * @name RemoveEventPageImage
 * @param {string} eventId (path) The ID of the event
 * @param {string} pageId (path) The ID of the page
 * @param {string} imageId (path) The ID of the image
 * @version 1.3
 **/
export interface RemoveEventPageImageParams extends MutationParams {
  eventId: string;
  pageId: string;
  imageId: string;
}

export const RemoveEventPageImage = async ({
  eventId,
  pageId,
  imageId,
  adminApiParams,
  queryClient,
}: RemoveEventPageImageParams): Promise<ConnectedXMResponse<EventPage>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<EventPage>>(
    `/events/${eventId}/pages/${pageId}/images/${imageId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PAGE_IMAGES_QUERY_KEY(eventId, pageId),
    });
    SET_EVENT_PAGE_QUERY_DATA(queryClient, [eventId, pageId], data);
  }
  return data;
};

export const useRemoveEventPageImage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventPageImage>>,
      Omit<RemoveEventPageImageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventPageImageParams,
    Awaited<ReturnType<typeof RemoveEventPageImage>>
  >(RemoveEventPageImage, options, {
    domain: "events",
    type: "update",
  });
};
