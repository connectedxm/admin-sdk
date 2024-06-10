import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Event } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../events/useGetEvent";

export const SERIES_EVENTS_QUERY_KEY = (seriesId: string) => [
  ...EVENT_QUERY_KEY(seriesId),
  "EVENTS",
];

export const SET_SERIES_EVENTS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof SERIES_EVENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSeriesEvents>>
) => {
  client.setQueryData(SERIES_EVENTS_QUERY_KEY(...keyParams), response);
};

interface GetSeriesEventsProps extends InfiniteQueryParams {
  seriesId: string;
}

export const GetSeriesEvents = async ({
  seriesId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetSeriesEventsProps): Promise<ConnectedXMResponse<Event[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/series/${seriesId}/events`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetSeriesEvents = (seriesId: string) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSeriesEvents>>>(
    SERIES_EVENTS_QUERY_KEY(seriesId),
    (params: any) => GetSeriesEvents(params),
    {
      seriesId,
    },
    {
      enabled: !!seriesId,
    }
  );
};

export default useGetSeriesEvents;
