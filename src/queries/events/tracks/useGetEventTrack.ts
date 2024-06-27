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
 * @category Keys
 * @group Events
 */
export const EVENT_TRACK_QUERY_KEY = (eventId: string, trackId: string) => [
  ...EVENT_TRACKS_QUERY_KEY(eventId),
  trackId,
];

/**
 * @category Setters
 * @group Events
 */
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

/**
 * @category Queries
 * @group Events
 */
export const GetEventTrack = async ({
  eventId,
  trackId,
  adminApiParams,
}: GetEventTrackProps): Promise<ConnectedXMResponse<EventTrack>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/tracks/${trackId}`);
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
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
    }
  );
};
