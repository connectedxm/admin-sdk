import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Event } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../events/useGetEvent";

/**
 * Endpoint to fetch events associated with a specific series.
 * This function retrieves a list of events for a given series, allowing users to view and manage events within that series.
 * It is designed to be used in applications where event management and retrieval are necessary.
 * @name GetSeriesEvents
 * @param {string} seriesId - The id of the series
 * @version 1.2
 **/

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
  adminApiParams,
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

export const useGetSeriesEvents = (
  seriesId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSeriesEvents>>
  > = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSeriesEvents>>>(
    SERIES_EVENTS_QUERY_KEY(seriesId),
    (params: InfiniteQueryParams) =>
      GetSeriesEvents({
        seriesId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!seriesId && (options.enabled ?? true),
    },
    "events"
  );
};