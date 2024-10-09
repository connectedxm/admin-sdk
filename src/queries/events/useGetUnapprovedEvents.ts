import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Event } from "@src/interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../useConnectedInfiniteQuery";
import { EVENTS_QUERY_KEY } from "./useGetEvents";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Events
 */
export const UNAPPROVED_EVENTS_QUERY_KEY = () => [
  ...EVENTS_QUERY_KEY(),
  "UNAPPROVED",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_UNAPPROVED_EVENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof UNAPPROVED_EVENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetUnapprovedEvents>>
) => {
  client.setQueryData(UNAPPROVED_EVENTS_QUERY_KEY(...keyParams), response);
};

interface GetUnapprovedEventsProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group Events
 */
export const GetUnapprovedEvents = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetUnapprovedEventsProps) => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/unapproved`, {
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
export const useGetUnapprovedEvents = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetUnapprovedEvents>>
  > = {}
) => {
  return useConnectedInfiniteQuery<ConnectedXMResponse<Event[]>>(
    UNAPPROVED_EVENTS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetUnapprovedEvents(params),
    params,
    options,
    "events"
  );
};
