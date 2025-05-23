import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventGalleryImage } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_GALLERY_IMAGES_QUERY_KEY } from "./useGetEventGalleryImages";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_GALLERY_IMAGE_QUERY_KEY = (
  eventId: string,
  galleryImageId: string
) => [...EVENT_GALLERY_IMAGES_QUERY_KEY(eventId), galleryImageId];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_GALLERY_IMAGE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_GALLERY_IMAGE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventGalleryImage>>
) => {
  client.setQueryData(EVENT_GALLERY_IMAGE_QUERY_KEY(...keyParams), response);
};

interface GetEventGalleryImageProps extends SingleQueryParams {
  eventId: string;
  galleryImageId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventGalleryImage = async ({
  eventId,
  galleryImageId,
  adminApiParams,
}: GetEventGalleryImageProps): Promise<
  ConnectedXMResponse<EventGalleryImage>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/images/${galleryImageId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventGalleryImage = (
  eventId: string = "",
  galleryImageId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventGalleryImage>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventGalleryImage>>(
    EVENT_GALLERY_IMAGE_QUERY_KEY(eventId, galleryImageId),
    (params: SingleQueryParams) =>
      GetEventGalleryImage({ eventId, galleryImageId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!galleryImageId && (options?.enabled ?? true),
    },
    "events"
  );
};
