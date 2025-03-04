import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventGalleryImage } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventGalleryImageUpdateInputs } from "@src/params";
import { EVENT_GALLERY_IMAGES_QUERY_KEY } from "@src/queries/events/galleryImages/useGetEventGalleryImages";
import { SET_EVENT_GALLERY_IMAGE_QUERY_DATA } from "@src/queries/events/galleryImages/useGetEventGalleryImage";

/**
 * @category Params
 * @group Event-GalleryImages
 */
export interface UpdateEventGalleryImageParams extends MutationParams {
  eventId: string;
  galleryImageId: string;
  image: EventGalleryImageUpdateInputs;
}

/**
 * @category Methods
 * @group Event-GalleryImages
 */
export const UpdateEventGalleryImage = async ({
  eventId,
  galleryImageId,
  image,
  adminApiParams,
  queryClient,
}: UpdateEventGalleryImageParams): Promise<
  ConnectedXMResponse<EventGalleryImage>
> => {
  if (!galleryImageId) throw new Error("Image ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<EventGalleryImage>
  >(`/events/${eventId}/images/${galleryImageId}`, {
    ...image,
    id: undefined,
    event: undefined,
    eventId: undefined,
    galleryImageId: undefined,
    _count: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    image: undefined,
  });

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_GALLERY_IMAGES_QUERY_KEY(eventId),
    });
    SET_EVENT_GALLERY_IMAGE_QUERY_DATA(
      queryClient,
      [eventId, galleryImageId || data.data?.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-GalleryImages
 */
export const useUpdateEventGalleryImage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventGalleryImage>>,
      Omit<UpdateEventGalleryImageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventGalleryImageParams,
    Awaited<ReturnType<typeof UpdateEventGalleryImage>>
  >(UpdateEventGalleryImage, options, {
    domain: "events",
    type: "update",
  });
};
