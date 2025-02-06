import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSpeaker } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_SESSION_QUERY_KEY } from "./useGetEventSession";

/**
 * Fetches speakers for a specific event session.
 * This function retrieves a list of speakers associated with a given event session, 
 * allowing applications to display or process speaker information for that session.
 * @name GetEventSessionSpeakers
 * @param {string} eventId (path) - The id of the event
 * @param {string} sessionId (path) - The id of the session
 * @version 1.3
 **/

export const EVENT_SESSION_SPEAKERS_QUERY_KEY = (
  eventId: string,
  sessionId: string
) => [...EVENT_SESSION_QUERY_KEY(eventId, sessionId), "SPEAKERS"];

export const SET_EVENT_SESSION_SPEAKERS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_SPEAKERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionSpeakers>>
) => {
  client.setQueryData(EVENT_SESSION_SPEAKERS_QUERY_KEY(...keyParams), response);
};

interface GetEventSessionSpeakersProps extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
}

export const GetEventSessionSpeakers = async ({
  eventId,
  sessionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionSpeakersProps): Promise<
  ConnectedXMResponse<EventSpeaker[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/speakers`,
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

export const useGetEventSessionSpeakers = (
  eventId: string = "",
  sessionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionSpeakers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionSpeakers>>
  >(
    EVENT_SESSION_SPEAKERS_QUERY_KEY(eventId, sessionId),
    (params: InfiniteQueryParams) =>
      GetEventSessionSpeakers({
        ...params,
        eventId,
        sessionId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!sessionId,
    },
    "events"
  );
};