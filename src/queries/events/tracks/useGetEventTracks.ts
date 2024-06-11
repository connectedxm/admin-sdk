import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Track } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";
import { QueryClient } from "@tanstack/react-query";

export const EVENT_TRACKS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
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
  adminApiParams,
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
export const useGetEventTracks = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetEventTracks>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetEventTracks>>>(
    EVENT_TRACKS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventTracks({
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
