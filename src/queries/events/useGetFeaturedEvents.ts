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
 * @category Keys
 * @group Events
 */
export const FEATURED_EVENTS_QUERY_KEY = () => [
  ...EVENTS_QUERY_KEY(),
  "FEATURED",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_FEATURED_EVENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof FEATURED_EVENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetFeaturedEvents>>
) => {
  client.setQueryData(FEATURED_EVENTS_QUERY_KEY(...keyParams), response);
};

interface GetFeaturedEventsProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group Events
 */
export const GetFeaturedEvents = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetFeaturedEventsProps) => {
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
/**
 * @category Hooks
 * @group Events
 */
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
