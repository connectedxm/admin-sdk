import { ConnectedXMResponse } from "@src/interfaces";
import { Session } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_TRACK_QUERY_KEY } from "./useGetEventTrack";

export const EVENT_TRACK_SESSIONS_QUERY_KEY = (
  eventId: string,
  trackId: string
) => [...EVENT_TRACK_QUERY_KEY(eventId, trackId), "SESSIONS"];

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

export const GetEventTrackSessions = async ({
  eventId,
  trackId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventTrackSessionsProps): Promise<ConnectedXMResponse<Session[]>> => {
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

const useGetEventTrackSessions = (eventId: string, trackId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventTrackSessions>>
  >(
    EVENT_TRACK_SESSIONS_QUERY_KEY(eventId, trackId),
    (params: any) => GetEventTrackSessions(params),
    {
      eventId,
      trackId,
    },
    {
      enabled: !!eventId && !!trackId,
    }
  );
};

export default useGetEventTrackSessions;
