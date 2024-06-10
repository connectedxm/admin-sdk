import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventPageTranslation } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "@/context/queries/useConnectedInfiniteQuery";
import { EVENT_PAGE_QUERY_KEY } from "../useGetEventPage";

export const EVENT_PAGE_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  pageId: string
) => [...EVENT_PAGE_QUERY_KEY(eventId, pageId), "TRANSLATIONS"];

export const SET_EVENT_PAGE_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_PAGE_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPageTranslations>>
) => {
  client.setQueryData(
    EVENT_PAGE_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventPageTranslationsProps extends InfiniteQueryParams {
  eventId: string;
  pageId: string;
}

export const GetEventPageTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  pageId,
}: GetEventPageTranslationsProps): Promise<
  ConnectedXMResponse<EventPageTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/pages/${pageId}/translations`,
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

const useGetEventPageTranslations = (eventId: string, pageId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPageTranslations>>
  >(
    EVENT_PAGE_TRANSLATIONS_QUERY_KEY(eventId, pageId),
    (params: any) => GetEventPageTranslations(params),
    {
      eventId,
      pageId,
    },
    {
      enabled: !!eventId && !!pageId,
    }
  );
};

export default useGetEventPageTranslations;
