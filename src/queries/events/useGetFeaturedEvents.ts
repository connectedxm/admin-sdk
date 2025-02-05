import { ConnectedXMResponse } from "@src/interfaces";
import { Event } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { EVENTS_QUERY_KEY } from "./useGetEvents";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Retrieves a list of featured events with support for pagination and filtering.
 * This function is designed to fetch events that are marked as featured, allowing users to view them with various filtering options.
 * It is useful in applications where showcasing highlighted events is necessary.
 * @name GetFeaturedEvents
 * @version 1.2
 **/

export const FEATURED_EVENTS_QUERY_KEY = () => [
  ...EVENTS_QUERY_KEY(),
  "FEATURED",
];

export const SET_FEATURED_EVENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof FEATURED_EVENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetFeaturedEvents>>
) => {
  client.setQueryData(FEATURED_EVENTS_QUERY_KEY(...keyParams), response);
};

interface GetFeaturedEventsProps extends InfiniteQueryParams {}

export const GetFeaturedEvents = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetFeaturedEventsProps): Promise<ConnectedXMResponse<Event[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/featured`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetFeaturedEvents = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetFeaturedEvents>>
  > = {}
) => {
  return useConnectedInfiniteQuery<ConnectedXMResponse<Event[]>>(
    FEATURED_EVENTS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetFeaturedEvents(params),
    params,
    options,
    "events"
  );
};
