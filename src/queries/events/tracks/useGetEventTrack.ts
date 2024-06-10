import { GetAdminAPI } from "@src/AdminAPI";
import { useConnectedSingleQuery } from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Track } from "@src/interfaces";
import { EVENT_TRACKS_QUERY_KEY } from "./useGetEventTracks";
import { QueryClient } from "@tanstack/react-query";

export const EVENT_TRACK_QUERY_KEY = (eventId: string, trackId: string) => [
  ...EVENT_TRACKS_QUERY_KEY(eventId),
  trackId,
];

export const SET_EVENT_TRACK_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_TRACK_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventTrack>>
) => {
  client.setQueryData(EVENT_TRACK_QUERY_KEY(...keyParams), response);
};

interface GetEventTrackProps {
  eventId: string;
  trackId: string;
}

export const GetEventTrack = async ({
  eventId,
  trackId,
}: GetEventTrackProps): Promise<ConnectedXMResponse<Track>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/tracks/${trackId}`);
  return data;
};

const useGetEventTrack = (eventId: string, trackId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventTrack>>(
    EVENT_TRACK_QUERY_KEY(eventId, trackId),
    () => GetEventTrack({ eventId, trackId: trackId || "unknown" }),
    {
      enabled: !!eventId && !!trackId,
    }
  );
};

export default useGetEventTrack;
