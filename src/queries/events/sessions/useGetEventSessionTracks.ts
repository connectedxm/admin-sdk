import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventTrack } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_SESSION_QUERY_KEY } from "./useGetEventSession";

/**
 * Fetches tracks for a specific event session with support for pagination and filtering.
 * This function is designed to retrieve a list of tracks associated with a given event session, 
 * allowing for detailed exploration of session content. It supports pagination and filtering 
 * to efficiently manage and access large datasets.
 * @name GetEventSessionTracks
 * @param {string} eventId - The id of the event
 * @param {string} sessionId - The id of the session
 * @version 1.2
 **/

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
  adminApiParams,
}: GetEventSessionTracksProps): Promise<ConnectedXMResponse<EventTrack[]>> => {
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

export const useGetEventSessionTracks = (
  eventId: string = "",
  sessionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionTracks>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionTracks>>
  >(
    EVENT_SESSION_TRACKS_QUERY_KEY(eventId, sessionId),
    (params: InfiniteQueryParams) =>
      GetEventSessionTracks({
        ...params,
        eventId,
        sessionId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!sessionId && (options.enabled ?? true),
    },
    "events"
  );
};