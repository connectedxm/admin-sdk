import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventTranslation } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "@/context/queries/useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";

export const EVENT_TRANSLATIONS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "TRANSLATIONS",
];

export const SET_EVENT_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventTranslations>>
) => {
  client.setQueryData(EVENT_TRANSLATIONS_QUERY_KEY(...keyParams), response);
};

interface GetEventTranslationsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
}: GetEventTranslationsProps): Promise<
  ConnectedXMResponse<EventTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/translations`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetEventTranslations = (eventId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventTranslations>>
  >(
    EVENT_TRANSLATIONS_QUERY_KEY(eventId),
    (params: any) => GetEventTranslations(params),
    {
      eventId,
    },
    {
      enabled: !!eventId,
    }
  );
};

export default useGetEventTranslations;
