import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Event } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

/**
 * @category Keys
 * @group Events
 */
export const EVENTS_QUERY_KEY = (past?: boolean) => {
  let keys = ["EVENTS"];
  if (typeof past !== "undefined") keys = [...keys, past ? "PAST" : "UPCOMING"];
  return keys;
};

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEvents>>
) => {
  client.setQueryData(EVENTS_QUERY_KEY(...keyParams), response);
};

interface GetEventsProps extends InfiniteQueryParams {
  past?: boolean;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEvents = async ({
  pageParam,
  pageSize,
  orderBy,
  past,
  search,
  adminApiParams,
}: GetEventsProps): Promise<ConnectedXMResponse<Event[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events`, {
    params: {
      past: typeof past !== "undefined" ? (past ? "true" : "false") : undefined,
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
export const useGetEvents = (
  past?: boolean,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetEvents>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetEvents>>>(
    EVENTS_QUERY_KEY(past),
    (params: InfiniteQueryParams) =>
      GetEvents({
        ...params,
        past,
      }),
    params,
    options,
    "events"
  );
};
