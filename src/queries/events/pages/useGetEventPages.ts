import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventPage } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";
import { QueryClient } from "@tanstack/react-query";

/**
 * Fetches event pages data from the admin API.
 * This function is designed to retrieve paginated data for event pages associated with a specific event ID.
 * It is useful for applications that need to display or manage multiple pages of event-related content.
 * @name GetEventPages
 * @param {string} eventId (path) The id of the event
 * @version 1.3
 **/

/**
 * @name EVENT_PAGES_QUERY_KEY
 * @description A query key generator for event pages
 */
export const EVENT_PAGES_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "PAGES",
];

/**
 * @name SET_EVENT_PAGES_QUERY_DATA
 * @description Sets the query data for event pages in the query client
 */
export const SET_EVENT_PAGES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PAGES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPages>>
) => {
  client.setQueryData(EVENT_PAGES_QUERY_KEY(...keyParams), response);
};

interface GetEventPagesProps extends InfiniteQueryParams {
  eventId: string;
}

/**
 * @name GetEventPages
 * @description Fetches event pages data from the admin API
 */
export const GetEventPages = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventPagesProps): Promise<ConnectedXMResponse<EventPage[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/pages`, {
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
 * @name useGetEventPages
 * @description A custom hook for fetching event pages data
 */
export const useGetEventPages = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetEventPages>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetEventPages>>>(
    EVENT_PAGES_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventPages({
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
