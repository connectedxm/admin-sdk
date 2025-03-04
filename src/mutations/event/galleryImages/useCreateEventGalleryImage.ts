import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventGalleryImage } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventGalleryImageCreateInputs } from "@src/params";
import { EVENT_GALLERY_IMAGES_QUERY_KEY } from "@src/queries/events/galleryImages/useGetEventGalleryImages";
import { SET_EVENT_GALLERY_IMAGE_QUERY_DATA } from "@src/queries/events/galleryImages/useGetEventGalleryImage";

/**
 * @category Params
 * @group Event-GalleryImages
 */
export interface CreateEventGalleryImageParams extends MutationParams {
  eventId: string;
  image: EventGalleryImageCreateInputs;
}

/**
 * @category Methods
 * @group Event-GalleryImages
 */
export const CreateEventGalleryImage = async ({
  eventId,
  image,
  adminApiParams,
  queryClient,
}: CreateEventGalleryImageParams): Promise<
  ConnectedXMResponse<EventGalleryImage>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventGalleryImage>
  >(`/events/${eventId}/images`, image);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_GALLERY_IMAGES_QUERY_KEY(eventId),
    });
    SET_EVENT_GALLERY_IMAGE_QUERY_DATA(
      queryClient,
      [eventId, data.data.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-GalleryImages
 */
export const useCreateEventGalleryImage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventGalleryImage>>,
      Omit<CreateEventGalleryImageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventGalleryImageParams,
    Awaited<ReturnType<typeof CreateEventGalleryImage>>
  >(CreateEventGalleryImage, options, {
    domain: "events",
    type: "update",
  });
};
