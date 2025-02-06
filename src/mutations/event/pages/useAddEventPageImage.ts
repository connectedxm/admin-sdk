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
 * Endpoint to add an image to a specific event page.
 * This function allows users to associate an image with a particular event page by specifying the event, page, and image identifiers.
 * It is designed to be used in applications where managing event page content is required.
 * @name AddEventPageImage
 * @param {string} eventId (path) The id of the event
 * @param {string} pageId (path) The id of the page
 * @param {string} imageId (path) The id of the image
 * @version 1.3
 **/
export interface AddEventPageImageParams extends MutationParams {
  eventId: string;
  pageId: string;
  imageId: string;
}

export const AddEventPageImage = async ({
  eventId,
  pageId,
  imageId,
  adminApiParams,
  queryClient,
}: AddEventPageImageParams): Promise<ConnectedXMResponse<EventPage>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post(
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

export const useAddEventPageImage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventPageImage>>,
      Omit<AddEventPageImageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventPageImageParams,
    Awaited<ReturnType<typeof AddEventPageImage>>
  >(AddEventPageImage, options, {
    domain: "events",
    type: "update",
  });
};
