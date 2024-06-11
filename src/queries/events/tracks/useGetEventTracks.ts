import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Track } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENTS_QUERY_KEY } from "../useGetEvents";
import { QueryClient } from "@tanstack/react-query";

export const EVENT_TRACKS_QUERY_KEY = (eventId: string) => [
  ...EVENTS_QUERY_KEY(eventId),
  "TRACKS",
];

export const SET_EVENT_TRACKS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_TRACKS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventTracks>>
) => {
  client.setQueryData(EVENT_TRACKS_QUERY_KEY(...keyParams), response);
};

interface GetEventTracksProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventTracks = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventTracksProps): Promise<ConnectedXMResponse<Track[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/tracks`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetEventTracks = (eventId: string) => {
  return useConnectedInfiniteQuery<ReturnType<typeof GetEventTracks>>(
    EVENT_TRACKS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) => GetEventTracks(params),
    {
      eventId,
    },
    {
      enabled: !!eventId,
    }
  );
};

export default useGetEventTracks;
