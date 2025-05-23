import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_GALLERY_IMAGES_QUERY_KEY } from "@src/queries/events/galleryImages/useGetEventGalleryImages";
import { EVENT_GALLERY_IMAGE_QUERY_KEY } from "@src/queries/events/galleryImages/useGetEventGalleryImage";

/**
 * @category Params
 * @group Event-GalleryImages
 */
export interface DeleteEventGalleryImageParams extends MutationParams {
  eventId: string;
  galleryImageId: string;
}

/**
 * @category Methods
 * @group Event-GalleryImages
 */
export const DeleteEventGalleryImage = async ({
  eventId,
  galleryImageId,
  adminApiParams,
  queryClient,
}: DeleteEventGalleryImageParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/images/${galleryImageId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_GALLERY_IMAGES_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_GALLERY_IMAGE_QUERY_KEY(eventId, galleryImageId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-GalleryImages
 */
export const useDeleteEventGalleryImage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventGalleryImage>>,
      Omit<DeleteEventGalleryImageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventGalleryImageParams,
    Awaited<ReturnType<typeof DeleteEventGalleryImage>>
  >(DeleteEventGalleryImage, options, {
    domain: "events",
    type: "update",
  });
};
