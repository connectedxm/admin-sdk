import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSession } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSIONS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "SESSIONS",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessions>>
) => {
  client.setQueryData(EVENT_SESSIONS_QUERY_KEY(...keyParams), response);
};

interface GetEventSessionsProps extends InfiniteQueryParams {
  eventId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessions = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionsProps): Promise<ConnectedXMResponse<EventSession[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/sessions`, {
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
export const useGetEventSessions = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessions>>
  >(
    EVENT_SESSIONS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventSessions({
        ...params,
        eventId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && (options.enabled ?? true),
    }
  );
};
