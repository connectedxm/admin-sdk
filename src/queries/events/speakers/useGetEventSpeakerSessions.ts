import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSession } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_SPEAKER_QUERY_KEY } from "./useGetEventSpeaker";
import { QueryClient } from "@tanstack/react-query";

/**
 * Fetches sessions for a specific speaker at a given event.
 * This function retrieves a list of sessions associated with a particular speaker within an event, 
 * allowing users to view detailed session information. It is designed for applications that need 
 * to display or manage event speaker sessions.
 * @name GetEventSpeakerSessions
 * @param {string} eventId - The id of the event
 * @param {string} speakerId - The id of the speaker
 * @version 1.2
 **/

export const EVENT_SPEAKER_SESSIONS_QUERY_KEY = (
  eventId: string,
  speakerId: string
) => [...EVENT_SPEAKER_QUERY_KEY(eventId, speakerId), "SESSIONS"];

export const SET_EVENT_SPEAKER_SESSIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SPEAKER_SESSIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSpeakerSessions>>
) => {
  client.setQueryData(EVENT_SPEAKER_SESSIONS_QUERY_KEY(...keyParams), response);
};

interface GetEventSpeakerSessionsProps extends InfiniteQueryParams {
  eventId: string;
  speakerId: string;
}

export const GetEventSpeakerSessions = async ({
  eventId,
  speakerId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSpeakerSessionsProps): Promise<
  ConnectedXMResponse<EventSession[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/speakers/${speakerId}/sessions`,
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

export const useGetEventSpeakerSessions = (
  eventId: string = "",
  speakerId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSpeakerSessions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSpeakerSessions>>
  >(
    EVENT_SPEAKER_SESSIONS_QUERY_KEY(eventId, speakerId),
    (params: InfiniteQueryParams) =>
      GetEventSpeakerSessions({
        ...params,
        eventId,
        speakerId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!speakerId && (options.enabled ?? true),
    },
    "events"
  );
};