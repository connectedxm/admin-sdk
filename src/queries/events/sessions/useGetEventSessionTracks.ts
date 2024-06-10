import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Track } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_SESSION_QUERY_KEY } from "./useGetEventSession";

export const EVENT_SESSION_TRACKS_QUERY_KEY = (
  eventId: string,
  sessionId: string
) => [...EVENT_SESSION_QUERY_KEY(eventId, sessionId), "TRACKS"];

export const SET_EVENT_SESSION_TRACKS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_TRACKS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionTracks>>
) => {
  client.setQueryData(EVENT_SESSION_TRACKS_QUERY_KEY(...keyParams), response);
};

interface GetEventSessionTracksProps extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
}

export const GetEventSessionTracks = async ({
  eventId,
  sessionId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventSessionTracksProps): Promise<ConnectedXMResponse<Track[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/tracks`,
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

const useGetEventSessionTracks = (eventId: string, sessionId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionTracks>>
  >(
    EVENT_SESSION_TRACKS_QUERY_KEY(eventId, sessionId),
    (params: any) => GetEventSessionTracks(params),
    {
      eventId,
      sessionId,
    },
    {
      enabled: !!eventId && !!sessionId,
    }
  );
};

export default useGetEventSessionTracks;
