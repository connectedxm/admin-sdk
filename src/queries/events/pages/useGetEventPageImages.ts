import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Image } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_PAGE_QUERY_KEY } from "./useGetEventPage";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PAGE_IMAGES_QUERY_KEY = (
  eventId: string,
  pageId: string
) => [...EVENT_PAGE_QUERY_KEY(eventId, pageId), "IMAGES"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PAGE_IMAGES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_PAGE_IMAGES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPageImages>>
) => {
  client.setQueryData(EVENT_PAGE_IMAGES_QUERY_KEY(...keyParams), response);
};

interface GetEventPageImagesProps extends InfiniteQueryParams {
  eventId: string;
  pageId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPageImages = async ({
  eventId,
  pageId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventPageImagesProps): Promise<ConnectedXMResponse<Image[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/pages/${pageId}/images`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventPageImages = (
  eventId: string = "",
  pageId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPageImages>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPageImages>>
  >(
    EVENT_PAGE_IMAGES_QUERY_KEY(eventId, pageId),
    (params: InfiniteQueryParams) =>
      GetEventPageImages({ ...params, eventId, pageId }),
    params,
    {
      ...options,
      enabled: !!eventId && !!pageId && (options.enabled ?? true),
    }
  );
};
