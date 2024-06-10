import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Image } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_PAGE_QUERY_KEY } from "./useGetEventPage";

export const EVENT_PAGE_IMAGES_QUERY_KEY = (
  eventId: string,
  pageId: string
) => [...EVENT_PAGE_QUERY_KEY(eventId, pageId), "IMAGES"];

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

export const GetEventPageImages = async ({
  eventId,
  pageId,
  pageParam,
  pageSize,
  orderBy,
  search,
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

const useGetEventPageImages = (eventId: string, pageId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPageImages>>
  >(
    EVENT_PAGE_IMAGES_QUERY_KEY(eventId, pageId),
    (params: any) => GetEventPageImages(params),
    {
      eventId,
      pageId,
    },
    {
      enabled: !!eventId && !!pageId,
    }
  );
};

export default useGetEventPageImages;
