import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventTrack } from "@src/interfaces";
import { EVENT_TRACKS_QUERY_KEY } from "./useGetEventTracks";
import { QueryClient } from "@tanstack/react-query";

/**
 * Fetches details for a specific event track by event and track IDs.
 * This function is used to retrieve detailed information about a particular track within an event.
 * It is designed for applications that require access to specific event track data.
 * @name GetEventTrack
 * @param {string} eventId (path) The ID of the event
 * @param {string} trackId (path) The ID of the track
 * @version 1.3
 **/

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

interface GetEventTrackProps extends SingleQueryParams {
  eventId: string;
  trackId: string;
}

export const GetEventTrack = async ({
  eventId,
  trackId,
  adminApiParams,
}: GetEventTrackProps): Promise<ConnectedXMResponse<EventTrack>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/tracks/${trackId}`);
  return data;
};

export const useGetEventTrack = (
  eventId: string = "",
  trackId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventTrack>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventTrack>>(
    EVENT_TRACK_QUERY_KEY(eventId, trackId),
    (params: SingleQueryParams) =>
      GetEventTrack({ eventId, trackId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!trackId && (options?.enabled ?? true),
    },
    "events"
  );
};
