import { ConnectedXMResponse } from "@src/interfaces";
import { EventSession } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_TRACK_QUERY_KEY } from "./useGetEventTrack";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_TRACK_SESSIONS_QUERY_KEY = (
  eventId: string,
  trackId: string
) => [...EVENT_TRACK_QUERY_KEY(eventId, trackId), "SESSIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_TRACK_SESSIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_TRACK_SESSIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventTrackSessions>>
) => {
  client.setQueryData(EVENT_TRACK_SESSIONS_QUERY_KEY(...keyParams), response);
};

interface GetEventTrackSessionsProps extends InfiniteQueryParams {
  eventId: string;
  trackId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventTrackSessions = async ({
  eventId,
  trackId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventTrackSessionsProps): Promise<
  ConnectedXMResponse<EventSession[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/tracks/${trackId}/sessions`,
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
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventTrackSessions = (
  eventId: string = "",
  trackId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventTrackSessions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventTrackSessions>>
  >(
    EVENT_TRACK_SESSIONS_QUERY_KEY(eventId, trackId),
    (params: InfiniteQueryParams) =>
      GetEventTrackSessions({
        ...params,
        eventId,
        trackId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!trackId,
    },
    "events"
  );
};
