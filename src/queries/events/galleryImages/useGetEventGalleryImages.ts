import { ConnectedXMResponse } from "@src/interfaces";
import { EventGalleryImage } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_GALLERY_IMAGES_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "GALLERY_IMAGES",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_GALLERY_IMAGES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_GALLERY_IMAGES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventGalleryImages>>
) => {
  client.setQueryData(EVENT_GALLERY_IMAGES_QUERY_KEY(...keyParams), response);
};

interface GetEventGalleryImagesProps extends InfiniteQueryParams {
  eventId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventGalleryImages = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventGalleryImagesProps): Promise<
  ConnectedXMResponse<EventGalleryImage[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/images`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventGalleryImages = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventGalleryImages>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventGalleryImages>>
  >(
    EVENT_GALLERY_IMAGES_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventGalleryImages({
        ...params,
        eventId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && (options.enabled ?? true),
    },
    "events"
  );
};
